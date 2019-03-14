
/**
 * This file establishes a socket connection with the server and provides every single
 * protocol need by every component of the UI
 * The socket connection can be created by using the only method available to the public (getServerConnect())
 * which will return a ServerConnect object. That object represent a socket connection and will be
 * univoque and shared between all client components.
 * Every protocol will be available through this object.
 * @module serverConnection
 * @author Danilo Del Busso, Mateusz Nowak, Jacopo Madaluni
 * @version 0.0.2
 */

import openSocket from 'socket.io-client';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const host = "http://localhost";
const port = 3265;

class ServerConnect {

    constructor(){
        this.loginToken = cookies.get("accessToken");
        this.currentRoom = "";
        this.socket = openSocket(`${host}:${port}`);

        this.onConnected = undefined;
        /**
        *   Triggered when a connection is established.
        */
        this.socket.on("connected", () => {
            console.log("connected successfully");
            this.socket.emit("join", "", this.currentRoom, true);
            this.onConnected();
        });

        this.onDisconnect = undefined;
        /**
        *   Triggered when the connection is lost.
        */
        this.socket.on("disconnect", () => {
            this.onDisconnect();
        });

        this.onTestAdded = undefined;
        this.onTestStatusChange = undefined;
        this.onTestEdit = undefined;
        this.onPatientEdit = undefined;

        /**
        *   Triggered when a new test is added.
        */
        this.socket.on("testAdded", newTest => {
            this.onTestAdded(newTest);
        });
        /**
        *   Triggered when a test status changes.
        */
        this.socket.on("testStatusChange", (id, status) => {
            this.onTestStatusChange(id, status);
        });
        /**
        *   Triggered when a patient is edited.
        */
        this.socket.on("patientEdited", (patientId, newInfo) => {
            this.onPatientEdit(patientId, newInfo);
        });
    }

    /**
    *   Protocol to delete the current authentication token.
    */
    deleteLoginToken(){
        this.loginToken = undefined;
        cookies.set('accessToken', "", { path: '/' });
    }
    /**
    * Set the current authentication token.
    * @param {String} token the new token
    */
    setLoginToken(token){
        this.loginToken = token;
        cookies.set('accessToken', token, { path: '/' });
    }

    /**
    * Joins the main page room in the server.
    */
    joinMainPage(){
        this.socket.emit("join", this.currentRoom, "main_page");
        this.currentRoom = "main_page";
    }

    /**
    * Joins the login page room in the server.
    */
    joinLoginPage(){
        this.socket.emit("join", this.currentRoom, "login_page");
        this.currentRoom = "login_page";
    }
    /**
    * Joins the patients page room in the server.
    */
    joinPatientsPage(){
        this.socket.emit("join", this.currentRoom, "patients_page");
        this.currentRoom = "patients_page";

    }

    /**
    * Sets the callback to be called when socket.on("connected") is triggered.
    * @param {function} callback
    */
    setOnConnect(callback){
        this.onConnected = callback;
    }
    /**
    * Sets the callback to be called when socket.on("disconnect") is triggered.
    * @param {function} callback
    */
    setOnDisconnect(callback){
        this.onDisconnect = callback;
    }

    /**
    * Sets the callback to be called when a new test is added
    * (when socket.on("testAdded")) is triggered
    * @param {function} callback
    */
    setOnTestAdded(callback){
        this.onTestAdded = callback;
    }

    /**
    * Sets the callback to be called when a test status is changed
    * (when socket.on("testStatusChange") is triggered)
    * @param {function} callback
    */
    setOnTestStatusChange(callback){
        console.log("set");
        this.onTestStatusChange = callback;
    }
    /**
    * Sets the callback to be called when a test is edited
    * -- no current action triggers this specific callback
    * -- current version calls socket.on("testAdded") callback
    * @param {function} callback
    */
    setOnTestEdit(callback){
        this.onTestEdit = callback;
    }
    /**
    * Sets the callback to be called when a patient is edited
    * (when socket.on("patientEdited") is triggered)
    * @param {function} callback
    */
    setOnPatientEdited(callback){
        this.onPatientEdit = callback;
    }

    /**
     * Function to be called when user needs to be authenticated
     * @param {JSON} credentials
     * @param {function} callback The callback function to be called on response
     * @example login({username: "exampleUsername", password: "examplePassword"})
     */
    login(credentials, callback){
        console.log("trying to log in");
        this.socket.emit('authenticate', credentials);
        this.socket.once('authenticationResponse', res => {
            callback(res);
        });
    }


    /**
     * Function to be called when all patients have to be retrieved.
     * @param {function} callback The callback function to be called on response
     */
    getAllPatients(callback){
        this.socket.emit('getAllPatients', this.loginToken);
        this.socket.once("getAllPatientsResponse", res => {
            callback(res);
        });
    }
    /**
     * Retrieves all information regarding a patient, calls the callback with the response.
     * @param {String} patientId The id of the patient
     * @param {function} callback
     */
    getFullPatientInfo(patientId, callback){
        this.socket.emit("getFullPatientInfo", patientId, this.loginToken);
        this.socket.once("getFullPatientInfoResponse", res => {
            callback(res);
        });
    }

    /**
     * Retrieves all tests in the database, calls the callback with the response
     * @param {function} callback
     */
    getAllTests(callback){
        this.socket.emit('getAllTests', this.loginToken);
        this.socket.once('getAllTestsResponse', res => {
            callback(res);
        });
    }

    /**
     * Retrieves all the tests of a particular patient, calls the callback with the response
     * @param {String} patientId The id of the patient we want to retrieve the information of.
     * @param {function} callback
     */
    getTestsOfPatient(patientId, callback){
        this.socket.emit('getTestsOfPatient', patientId, this.loginToken);
        this.socket.once('getTestsOfPatientResponse', res => {
            callback(res.info);
        });
    }

    /**
     * Retrieves all the tests in a particular date, calls the callback with the response
     * @param {Date} date The id of the patient we want to retrieve the information of.
     * @param {function} callback
     */
    getTestsOnDate(date, callback){
        this.socket.emit('getAllTestsOnDate', date, this.loginToken);
        this.socket.once('getAllTestsOnDateResponse', res => {
            callback(res);
        });
    }

    /**
     * Retrieves all overdue tests, calls the callback with the response.
     * @param {function} callback
     */
    getOverdueTests(callback){
        this.socket.emit('getOverdueTests', this.loginToken);
        this.socket.once('getOverdueTestsResponse', res => {
            callback(res);
        });
    }

    /**
     * Retrieves all tests in a week, calls the callback with the response.
     * @param {Date} date Any date on the week we want to select
     * @param {boolean} anydayTestsOnly True if you only want the tests that are not scheduled on a particular day.
     * @param {function} callback
     */
    getTestsInWeek(date, callback, anydayTestsOnly=false){
        console.log("asking for tests");
        console.log(this.loginToken);
        this.socket.emit('getTestsInWeek', date, this.loginToken);
        this.socket.once('getTestsInWeekResponse', res => {
            callback(res.response);
        });
    }

    // TODO: what is this???
    getMockTest(testId, callback){
        const duedate = new Date(2019, 3, 4);
        const mockedTest = {
            patient_name: "John Doe",
            patient_no: "P123890",
            test_id: 123,
            due_date: "2019-3-3",
            frequency: "2-W",
            occurrences: 3,
            completed_status: "no",
            notes: "This guys is basically just an idiot",
            completedDate: null,
            hospitalId: 3

        }
        setTimeout( () => {
            callback(mockedTest);
        }, 3000);
    }

    /**
     * Retrieves the information regarding a test, calls the callback with the response.
     * @param {int} testId The id of the test
     * @param {function} callback
     */
    getTestInfo(testId, callback){
        this.socket.emit("getTestInfo", testId, this.loginToken);
        this.socket.once("getTestInfoResponse", res => {
            callback(res.response[0]);
        });
    }
    /**
     * Requests a token to edit the choosen test, calls the callback with the response.
     * @param {int} testId The id of the test
     * @param {function} callback
     */
    requestTestEditing(testId, callback){
        this.socket.emit("requestTestEditToken", testId, this.loginToken);
        this.socket.once("requestTestEditTokenResponse", token => {
            callback(token);
        });
    }
    /**
     * Requests a token to edit the choosen patient, calls the callback with the response.
     * @param {String} patientId The id of the patient
     * @param {function} callback
     */
    requestPatientEditing(patientId, callback){
        this.socket.emit("requestPatientEditToken", patientId, this.loginToken);
        this.socket.once("requestPatientEditTokenResponse", token => {
            callback(token);
        });
    }
    /**
     * Requests the distruction of the token previously received to edit a test, calls the callback with the response.
     * @param {int} testId The id of the test
     * @param {String} token The token to destroy.
     * @param {function} callback
     */
    discardTestEditing(testId, token, callback){
        this.socket.emit("discardEditing", "Test", testId, token, this.loginToken);
        this.socket.once("discardEditingResponse", res => {
            callback(res);
        });
    }
    /**
     * Requests the distruction of the token previously received to edit a patient, calls the callback with the response.
     * @param {int} patientId The id of the patient
     * @param {String} token The token to destroy.
     * @param {function} callback
     */
    discardPatientEditing(patientId, token, callback){
        this.socket.emit("discardEditing", "Patient", patientId, token, this.loginToken);
        this.socket.once("discardEditingResponse", res => {
            callback(res);
        });
    }

    /**
    * Thim method emits a request to add a test into the database, calls the callback with the response
    * @param {String} patientId The number of the patient that has to take the test.
    * @param {Date} date The first due date of the test
    * @param {String} notes Additional info about the test
    * @param {String} frequency The frequency of the test
    * @example var frequencyExample = "3:W"; // Read db manual for more info
    * @param {int} occurrences The number of times to repeat the test
    * @param {function} callback
    */
    addTest(patientId, date, notes, frequency, occurrences, callback){
        this.socket.emit("addTest", patientId, date, notes, frequency, occurrences, this.loginToken);
        this.socket.once("addTestResponse", res => {
            callback(res);
        });
    }

    /**
    * Thim method emits a request to add a test into the database, calls the callback with the response
    * @param {int} testId The id of the test to be changed.
    * @param {String} newStatus The new status of the test
    * @example var statusExample = "completed" // Read db manual for more info
    * @param {function} callback
    */
    changeTestStatus(testId, newStatus, callback){
        this.socket.emit('testStatusChange', testId, newStatus, this.loginToken);
        this.socket.once("testStatusChangeResponse", res => {
            callback(res);
        });
    }
    /**
    * Thim method emits a request to change a test due date, calls the callback with the response
    * @param {int} testId The id of the test to be changed.
    * @param {Date} newDate The new status of the test
    * @param {function} callback
    */
    changeTestDueDate(testId, newDate, callback){
        this.socket.emit("changeTestDueDate", testId, newDate, this.loginToken);
        this.socket.once("changeTestDueDateResponse", res => {
            callback(res);
        });
    }

    /**
    * Thim method emits a request to edit a test into the database, calls the callback with the response.
    * @param {int} testId The id of the test to be changed.
    * @param {JSON} newData All the information about the test
    * @param {String} token The token that grants editing priviledges.
    * @param {function} callback
    */
    editTest(testId, newData, token, callback){
        this.socket.emit("editTest", testId, newData, token, this.loginToken);
        this.socket.once("editTestResponse", response => {
            callback(response);
        });
    }
    /**
    * Thim method emits a request to edit a patient into the database, calls the callback with the response.
    * @param {String} patientId The id of the patient to be changed.
    * @param {JSON} newData All the information about the patient
    * @param {String} token The token that grants editing priviledges.
    * @param {function} callback
    */
    editPatient(patientId, newData, token, callback){
        this.socket.emit("editPatient", patientId, newData, token, this.loginToken);
        this.socket.once("editPatientResponse", res => {
            callback(res);
        });
    }
}


let serverConnect = new ServerConnect();
/**
* Function to get the unique instance of the server connection
* @returns {ServerConnect}
*/
function getServerConnect(){
    if (typeof serverConnect === undefined){
        serverConnect = new ServerConnect();
    }
    return serverConnect;
}
export {getServerConnect};
