<template>
  <div>
    <side-bar/>
    <top-bar/>

    <v-container>

      <v-card style="width: 98%; height: 75px; margin-left: 1%; border-radius: 36px">
        <v-row style="width: 98%;" class="ma-1">
          <v-col class="ml-4">
            <v-select v-on:input="changeExercises()" :items="categories" label="Categorias" v-model="categorySelected"
                      solo flat append-icon="mdi-menu-swap" class="opciones" style="overflow: hidden; !important;"/>
          </v-col>
          <v-col>
            <div>
              <v-text-field v-model="searchTerm" v-on:input="search()" v-on:keydown.enter="reset()"
                            label="Buscar por nombre" prepend-icon="mdi-magnify" class="opciones" solo flat/>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <div class="text-center my-15" v-if="loading">
        <v-progress-circular size="200" width="15" style="position: relative; top: 40%"
                             indeterminate
                             color="primary"/>
      </div>
      <v-row class="my-10" justify="space-around" v-else>
        <v-col v-for="n in exercises.length" :key="n">
          <exercise-card :exercise_object='exercises[n-1]' :type="categorySelected" class="mx-auto"/>
        </v-col>
      </v-row>


    </v-container>

    <boton-generar texto="Generar nuevo ejercicio" path="/generar_ejercicio"/>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar"
import TopBar from "@/components/TopBar"
import ExerciseCard from "@/components/exerciseCard";
import {ExercisesApi} from "@/api/exercises";
import BotonGenerar from "@/components/BotonGenerar";

export default {
  name: "exercises",
  components: {BotonGenerar, ExerciseCard, TopBar, SideBar},
  data() {
    return {
      loading: true,
      exercises: [],
      categories: ['Biceps', 'Triceps', 'Pecho', 'Espalda', 'Abdominales', 'Piernas', 'Todos'],
      categorySelected: 'Todos',
      searchTerm: '',
      insensi: 0,
    }
  },
  methods: {
    async changeExercises() {
      if (this.categorySelected === this.categories[6]) {
        this.exercises = await ExercisesApi.getMasterExercises(null);
      } else {
        this.exercises = await ExercisesApi.getByType(this.categorySelected, null);
      }
    },
    search() {
      let vector = [];
      for (let i = 0; i < this.exercises.length; i++) {
        if ((this.exercises[i].name).includes(this.searchTerm)) {
          vector.push(this.exercises[i]);
        }
      }
      this.exercises = vector;
    },
    async reset() {
      this.loading = true;
      this.exercises = await ExercisesApi.getMasterExercises(null);
      this.loading = false;
    },
  },
  async created() {
    this.exercises = await ExercisesApi.getMasterExercises(null);
    console.log(this.exercises);
    this.loading = false;
  },
}
</script>

<style scoped>
@font-face {
  font-family: "NotoSans-Regular";
  src: url("../../assets/fonts/NotoSans-Regular.ttf");
}

.opciones {
  font-size: 20px;
  font-family: NotoSans-Regular, sans-serif;
}
</style>