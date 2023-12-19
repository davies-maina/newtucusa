<template>
  <v-container style="position: sticky; top: 0;">
    <v-row justify="center" align="center" style="height: 50vh;">
      <!-- Checkbox row -->

      <v-row justify="center">
        <v-col v-for="(checkbox, index) in checkBoxes" :key="index" cols="auto">
          <v-checkbox v-model="selected" :label="checkbox.label" :value="checkbox.value" />
        </v-col>
      </v-row>

      <!-- End of checkbox row -->

      <v-col cols="12" sm="8" md="12">
        <div v-if="loadingAllOpportunities" class="text-center">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <Useropportunities v-else :title="'Schorlaships/Bursaries'" :opportunities="filteredOpps" :cdfbanner="cdfSelected" :home="consHome" />
        <!-- <Useropportunities v-else></Useropportunities> -->
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
// 'Turkana county Govt', 'National govt', 'NGO', 'CBO', 'CDF'
import { collection, query, where, getDocs, doc } from 'firebase/firestore'
import { type Iopportunity } from '~/helpers/interface'
const db = useFirestore()
const allOpportunities = ref<Iopportunity[]>([])
const selected = ref<string[]>([])
const loadingAllOpportunities = ref(false)
const cdfSelected = ref(true)
const consHome = ref('')
watchEffect(() => {
  cdfSelected.value = selected.value.includes('CDF')
  // console.log(selected.value.includes('CDF'))
})
const checkBoxes = ref([{
  label: 'Turkana County Government',
  value: 'Turkana county Govt'
},
{
  label: 'National Government',
  value: 'National govt'
},
{
  label: 'NGO',
  value: 'NGO'
},
{
  label: 'CBO',
  value: 'CBO'
},
{
  label: 'CDF',
  value: 'CDF'
},
])

const user = useCurrentUser()

onMounted(async () => {
  loadingAllOpportunities.value = true
  const { promise } = useDocument(doc(collection(db, 'residential_home_details'), `${user.value?.uid}`))
  await promise.value.then((home) => {
    if (home !== null) {
      consHome.value = home!.constituency
      getAllOpportunities(home!.constituency).then(() => {
        selectAll()
      })
    }
  })
})
const getAllOpportunities = async (homeCon: string) => {
  // console.log('cval', constituency.value)
  const query1 = query(collection(db, 'schorlaships'), where('provider', 'in', ['Turkana county Govt', 'National govt', 'NGO', 'CBO']),)
  const query2 = query(collection(db, 'schorlaships'), where('constituency', '==', homeCon))
  // const query2 = query(collection(db, "internships"));
  // const query3 = query(collection(db, "jobs"));

  try {
    loadingAllOpportunities.value = true
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(query1),
      getDocs(query2),
      // getDocs(query3)
    ])
    const combinedResults = new Map()
    snapshot1.forEach((doc) => {
      const opportunity = doc.data() as Iopportunity
      // opportunity.id = doc.id; // Adding the document ID as the id property
      // allOpportunities.value.push(opportunity);
      combinedResults.set(doc.id, { ...opportunity, id: doc.id })
    })
    snapshot2.forEach((doc) => {
      // combinedResults.set(doc.id, doc.data());
      const opportunity = doc.data() as Iopportunity
      // opportunity.id = doc.id; // Adding the document ID as the id property
      // allOpportunities.value.push(opportunity);
      combinedResults.set(doc.id, { ...opportunity, id: doc.id })
    })
    // console.log('dd', Array.from(combinedResults.values()) as Iopportunity[])
    const opps = Array.from(combinedResults.values()) as Iopportunity[]
    allOpportunities.value = opps

    loadingAllOpportunities.value = false
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching data:', error)
    loadingAllOpportunities.value = false
  }
}
const filteredOpps = computed(() => {
  if (allOpportunities.value.length > 0) {
    return allOpportunities.value.filter(opportunity => selected.value.includes(opportunity.provider))
  }
  return []
})
const selectAll = () => {
  checkBoxes.value.forEach(box => selected.value.push(box.value))
}
</script>
