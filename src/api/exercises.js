import { Api } from './api.js';


const string_type= [ 'Biceps', 'Triceps', 'Pecho', 'Espalda', 'Abdominales', 'Piernas'];


let tipos= {};
tipos[string_type[0]] = 1;
tipos[string_type[1]] = 2;
tipos[string_type[2]] = 3;
tipos[string_type[3]] = 4;
tipos[string_type[4]] = 5;
tipos[string_type[5]] = 6;

class Exercise{
    constructor(name , detail , id , type) {
        this.name = name;
        this.id = id;
        this.detail = detail;
        this.type = type
    }
}
class ExercisesApi {
    static get url() {
        return Api.baseUrl;
    }
    //getters
    static async getExerciseFromCycle( routineId , cycle_id , controller) {
        const result = await Api.get(Api.baseUrl + '/routines/' + routineId + '/cycles/' + cycle_id + '/exercises?page=0&size=99&orderBy=name&direction=asc' , true , controller);
        if ( result.code ){
            console.log("get from exercises got error")
            return result;
        }
        console.log(result);
        return result.results;
    }
    static async getByType( type , controller){
        if ( !string_type.includes(type)) {
            return {
                code: 1,
                detail: "type doesnt exist"
            }
        }
        let vec = [];
        let result = await this.getExerciseFromCycle( 1 , tipos[type] , controller)
        if ( result.code){
            return result;
        }
        for ( let i = 0 ; i < result.length ; i++){
            vec.push(new Exercise(result[i].name , result[i].detail, result[i].id , tipos[type]) );
        }
        return vec;
    }
    static async getMasterExercises( controller ){
        let result;
        let j , i;
        let final = [];
        for(  i = 1 ; i < 7; i++){
            result = await this.getExerciseFromCycle(1 , i , controller);
            console.log("from cycle got:");
            console.log(result);
            if ( result.code ){
                return result;
            }
            for ( j = 0 ; j < result.length ; j++ ){
                final.push(new Exercise(result[j].name , result[j].detail , result[j].id , i));
            }
        }
        return final;
    }
    //Posters
    static async addExercise(data, id , cycle_id , controller){
        console.log("Adding to rutine id: " + id);
        console.log("Addint to cycle_id: " + cycle_id);
        const path = Api.baseUrl + '/routines/' + id + '/cycles/' + cycle_id + '/exercises?page=0&size=99&orderBy=name&direction=asc';
        const send = {
            'name': data.name,
            'detail': data.detail,
            'type':'exercise',
            'duration': 0,
            'repetitions': 50,
        }
        return await Api.post( path , true , send , controller);
    }
    static async postMasterExercise( data , controller){
        if ( !string_type.includes(data.type)){
            return [];
        }
        let cycle_id = tipos[data.type];
        return  await this.addExercise(data ,1 , cycle_id ,controller);
    }
    //Editers
    static async editMasterExercise( data , controller){
        const path = Api.baseUrl + '/routines/1/cycles/' + data.type + '/exercises/' + data.id;
        const send = {
            'name': data.name,
            'detail': data.detail,
            'type': "exercise",
            'duration': 0,
            'repetitions': 50
        };
        return await Api.put( path , true , send , controller);
    }
    //Deleters
    static async deleteExercise( routineId , cycleId , exerciseId, controller){
        const path =  Api.baseUrl + '/routines/' + routineId + '/cycles/' + cycleId + '/exercises/' + exerciseId;
        return Api.delete(path , true , controller);
    }
    static async deleteMasterExercise( id , type , controller){
        return this.deleteExercise( 1 , type , id , controller);
    }
}


export { ExercisesApi};

