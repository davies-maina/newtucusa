<template>
  <v-container style="position: sticky; top: 0;">

    <v-row justify="center" align="center" style="height: 50vh;">
      <!-- Checkbox row -->





      <v-row justify="center"><v-col cols="auto" v-for="(checkbox, index) in checkBoxes" :key="index">

          <v-checkbox v-model="selected" :label="checkbox.label" :value="checkbox.value"></v-checkbox>

        </v-col></v-row>


      <!-- End of checkbox row -->

      <v-col cols="12" sm="8" md="12">
        <div v-if="loadingAllOpportunities" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <Useropportunities :title="'Jobs'" :opportunities="filteredOpps" v-else></Useropportunities>
        <!-- <Useropportunities v-else></Useropportunities> -->
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { collection, query, getDocs } from "firebase/firestore";

import { Iopportunity } from '~/helpers/interface';
const db = useFirestore()
const loadingAllOpportunities = ref(false)
const selected = ref<string[]>([])
onMounted(async () => {
  await getAllOpportunities()
  selectAll()
})
const selectAll = () => {
  checkBoxes.value.forEach((box) => selected.value.push(box.value))
}
const allInternships = ref<Iopportunity[]>([])
const checkBoxes = ref([{
  label: "Turkana County Government",
  value: "Turkana county Govt"
},
{
  label: "National Government",
  value: "National govt"
},
{
  label: "NGO",
  value: "NGO"
},
{
  label: "CBO",
  value: "CBO"
},
{
  label: "CDF",
  value: "CDF"
},
])
const getAllOpportunities = async () => {
  const query1 = query(collection(db, "jobs"));

  // const query2 = query(collection(db, "internships"));
  // const query3 = query(collection(db, "jobs"));

  try {
    loadingAllOpportunities.value = true
    const [snapshot1] = await Promise.all([
      getDocs(query1),
      // getDocs(query2),
      // getDocs(query3)
    ]);

    snapshot1.forEach(doc => {
      const opportunity = doc.data() as Iopportunity;
      opportunity.id = doc.id; // Adding the document ID as the id property
      allInternships.value.push(opportunity);
    });
    // snapshot2.forEach(doc => {
    //   const opportunity = doc.data() as Iopportunity;
    //   opportunity.id = doc.id; // Adding the document ID as the id property
    //   allOpportunities.value.push(opportunity);
    // });
    // snapshot3.forEach(doc => {
    //   const opportunity = doc.data() as Iopportunity;
    //   opportunity.id = doc.id; // Adding the document ID as the id property
    //   allOpportunities.value.push(opportunity);
    // });
    loadingAllOpportunities.value = false
  } catch (error) {
    console.error("Error fetching data:", error);
    loadingAllOpportunities.value = false
  }
}
const filteredOpps = computed(() => {
  if (allInternships.value.length > 0) {
    return allInternships.value.filter(opportunity => selected.value.includes(opportunity.provider))
  }
  return []
})
</script>