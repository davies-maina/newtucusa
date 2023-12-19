<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <p>by Gender</p>
        <v-select
          v-model="gender"
          :items="genderVals"
          label="filter gender"
          item-title="gender"
          item-value="value"
        />
        {{ gender }}
      </v-col>
      <v-col cols="2">
        <p>by location/county</p>
        <v-select
          v-model="county"
          :items="countyVals"
          label="filter location"
          item-title="county"
          item-value="value"
          @update:model-value="handleLocation"
        />
        {{ county }}
      </v-col>
      <v-col v-if="showConsField" cols="2">
        <p>by constituency</p>
        <v-select
          v-model="constituency"
          :items="subcounties"
          label="filter subcounty"
          item-title="subcounty"
          item-value="value"
          @update:model-value="handleCon"
        />
        {{ constituency }}
      </v-col>
      <v-col v-if="showWardsField" cols="2">
        <p>by ward</p>
        <v-select v-model="ward" item-title="ward" item-value="value" :items="wards" label="filter ward" />
        {{ ward }}
      </v-col>
      <v-col cols="2">
        <p>by academic program</p>
        <v-select
          v-model="academicprogram"
          item-title="ap"
          item-value="value"
          :items="[{ ap: 'None', value: null }, { ap: 'Certificate', value: 'Certificate' },
                   { ap: 'Diploma', value: 'Diploma' }, { ap: 'Undergraduate', value: 'Undergraduate' },
                   { ap: 'Post-graduate diploma', value: 'Post-graduate diploma' },
                   { ap: 'Masters', value: 'Masters' }, { ap: 'PhD', value: 'PhD' }]"
          label="filter academic program"
        />
        {{ academicprogram }}
      </v-col>
    </v-row>
    Total students(by filter): {{ filteredUsers.length }}

    <v-btn v-if="filteredUsers.length>0" color="primary" class="mx-3" @click="downloadFile">
      Export to excel
    </v-btn>
    <!-- {{ users }} -->

    <v-data-table :loading="loading" :items="filteredUsers">
      <template #loading>
        <v-skeleton-loader type="table-row@10" />
      </template>
    </v-data-table>
  </v-container>
</template>
<script lang="ts" setup>
import type { QuerySnapshot, DocumentData } from 'firebase/firestore'
import { collection, query, getDocs } from 'firebase/firestore'
import { VDataTable, VSkeletonLoader } from 'vuetify/lib/components/index.mjs'
import exportFromJSON from 'export-from-json'
import counties from '~/helpers/counties'
import constituencies from '~/helpers/constituencies'

import type { UserProfile } from '~/helpers/interface'

const { finalCounties } = getCounties()
const countyVals = [{ county: 'None', value: null },
{ county: 'Diaspora', value: 'Diaspora' }, ...finalCounties.map(county => ({ county, value: county }))]
// import { VDataTable } from 'vuetify/labs/VDataTable'
// import { VSkeletonLoader } from "vuetify/lib/labs/components.mjs";
const genderVals = [{ gender: 'None', value: null }, { gender: 'Male', value: 'Male' }, { gender: 'Female', value: 'Female' }]
const gender = ref(null)
const county = ref(null)
const constituency = ref(null)

const ward = ref(null)
const academicprogram = ref(null)
const subcounties = ref<any[]>([])
const wards = ref<any[]>([])
const showConsField = ref(false)
const showWardsField = ref(false)
const db = useFirestore()
type querySnapshot = QuerySnapshot<DocumentData, DocumentData>
interface MergedData {
    [key: string]: any; // Or a more specific type if you know the structure of your documents
}

const users = ref<UserProfile[]>([])
const loading = ref(false)
onMounted(async () => {
    await getAllOpportunities()
})
function downloadFile () {
  const data = filteredUsers.value
  const fileName = 'student-data'
  const exportType = exportFromJSON.types.csv
  exportFromJSON({ data, fileName, exportType })
}
function handleLocation (value: any) {
    constituency.value = null

    if (value !== 'Diaspora') {
        const subs = getSubCountiesByName(value)
        subcounties.value = subs
        showConsField.value = true
    } else {
        showConsField.value = false
    }

    if (value === 'Turkana') {
        showWardsField.value = true
    } else {
        showWardsField.value = false
    }
}
function handleCon (value: any) {
    const wrds = getWardsByCon(value)
    wards.value = wrds
}
function getSubCountiesByName (countyName: string) {
    const county = counties.find(c => c.name === countyName)
    return county
        ? [{ subcounty: 'None', value: null }, ...county.sub_counties.map(sub => ({ subcounty: sub, value: sub }))]
        : [{ subcounty: 'None', value: null }]
}
function getWardsByCon (constituencyName: string) {
    const constituency = constituencies.find(item => item.name === constituencyName)
    return constituency
        ? [{ ward: 'None', value: null }, ...constituency.wards.map(ward => ({ ward, value: ward }))]
        : [{ ward: 'None', value: null }]
    // if (constituency()) {
    //     return constituency()?.wards
    // }
}
const getAllOpportunities = async () => {
    const query1 = query(collection(db, 'personal_details'))
    const query2 = query(collection(db, 'school_details'))
    const query3 = query(collection(db, 'residential_home_details'))

    try {
        loading.value = true
        const [snapshot1, snapshot2, snapshot3] = await Promise.all([
            getDocs(query1),
            getDocs(query2),
            getDocs(query3)
        ])

        const mergedResults = mergeDocuments(snapshot1, snapshot2, snapshot3)
        const arrayResults = Object.keys(mergedResults).map((docId) => {
            const mergeDoc = mergedResults[docId] as UserProfile
            const userDetail: UserProfile = {
                id: docId,
                firstname: mergeDoc.firstname ?? '',
                lastname: mergeDoc.lastname ?? '',
                gender: mergeDoc.gender ?? '',
                dob: mergeDoc.dob ?? '',
                nationalid: mergeDoc.nationalid ?? '',
                phonenumber: mergeDoc.phonenumber ?? '',
                address: mergeDoc.address ?? '',
                postalcode: mergeDoc.postalcode ?? '',
                location: mergeDoc.location ?? '',
                constituency: mergeDoc.constituency ?? '',
                ward: mergeDoc.ward ?? '',
                institutionname: mergeDoc.institutionname ?? '',
                institutiontype: mergeDoc.institutiontype ?? '',
                institutioncounty: mergeDoc.institutioncounty ?? '',
                academicprogram: mergeDoc.academicprogram ?? '',
                coursecategory: mergeDoc.coursecategory ?? '',
                coursetaken: mergeDoc.coursetaken ?? '',
                schoolid: mergeDoc.schoolid ?? ''

            }
            return userDetail
            //     id: docId,
            //     ...mergedResults[docId]
            // }
        })
        users.value = arrayResults
        loading.value = false

        // console.log('usss', arrayResults)
    } catch (error) {
        loading.value = false

        // eslint-disable-next-line no-console
        console.error('Error fetching data:', error)
    }
}

const mergeDocuments = (docs1: querySnapshot, docs2: querySnapshot, docs3: querySnapshot) => {
    const merged: MergedData = {};

    [docs1, docs2, docs3].forEach((docs) => {
        docs.forEach((doc) => {
            const docId = doc.id
            if (!merged[docId]) {
                merged[docId] = {}
            }
            // Merge data from each doc into the corresponding merged doc
            merged[docId] = { ...merged[docId], ...doc.data() }
        })
    })

    return merged
}

type fil = string | null
const filterData = (gender: fil, county: fil, ward: fil, constituency: fil, academicProgram: fil) => {
    return users.value.filter(user =>
        (county ? user.location === county : true) &&
        (gender ? user.gender === gender : true) &&
        (ward ? user.ward === ward : true) &&
        (constituency ? user.constituency === constituency : true) &&
        (academicProgram ? user.academicprogram === academicProgram : true)
    )
}

const filteredUsers = computed(() => {
    return filterData(gender.value, county.value, ward.value, constituency.value, academicprogram.value)
})
</script>
