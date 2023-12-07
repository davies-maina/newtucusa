<template>
    <v-container>
        Total students: {{ users.length }}
        <!-- {{ users }} -->
        <v-data-table :loading="loading" :items="users">
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
        </v-data-table>
    </v-container>
</template>
<script lang="ts" setup>
import { collection, query, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import { VDataTable } from "vuetify/lib/components/index.mjs";
import { VSkeletonLoader } from "vuetify/lib/components/index.mjs";
// import { VDataTable } from 'vuetify/labs/VDataTable'
// import { VSkeletonLoader } from "vuetify/lib/labs/components.mjs";
const db = useFirestore()
type querySnapshot = QuerySnapshot<DocumentData, DocumentData>
interface MergedData {
    [key: string]: any; // Or a more specific type if you know the structure of your documents
}
const users = ref<any[]>([])
const loading = ref(false)
onMounted(async () => {

    await getAllOpportunities()
})
const getAllOpportunities = async () => {
    const query1 = query(collection(db, "personal_details"));
    const query2 = query(collection(db, "school_details"));
    const query3 = query(collection(db, "residential_home_details"));

    try {
        loading.value = true
        const [snapshot1, snapshot2, snapshot3] = await Promise.all([
            getDocs(query1),
            getDocs(query2),
            getDocs(query3)
        ]);

        const mergedResults = mergeDocuments(snapshot1, snapshot2, snapshot3);
        const arrayResults = Object.keys(mergedResults).map(docId => {
            return {
                id: docId,
                ...mergedResults[docId]
            };
        });
        users.value = arrayResults
        loading.value = false

        // console.log('usss', arrayResults)
    } catch (error) {
        loading.value = false

        console.error("Error fetching data:", error);
    }
}

const mergeDocuments = (docs1: querySnapshot, docs2: querySnapshot, docs3: querySnapshot) => {
    let merged: MergedData = {};

    [docs1, docs2, docs3].forEach(docs => {
        docs.forEach(doc => {
            const docId = doc.id;
            if (!merged[docId]) {
                merged[docId] = {};
            }
            // Merge data from each doc into the corresponding merged doc
            merged[docId] = { ...merged[docId], ...doc.data() };
        });
    });

    return merged;
};
</script>