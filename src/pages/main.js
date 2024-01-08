import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Button, CardActionArea, CardContent } from "@mui/material";
import Typography from '@mui/material/Typography';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { baseUrl } from "../utils/helperFunctions";

function Dashboard() {
    const [data, setData] = useState([]);
    const [updateMessage, setUpdateMessage] = useState('');
    const [selectedTask, setSelectedTask] = useState();
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('success');
    const [displayModal, setDisplayModal] = useState({newTask:false})
    const [taskProfile, setTaskProfile] = useState(); 
    const [displayDetails, setDisplayDetails] = useState(false)

    // const [displayNewTaskModal,setDisplayNewTaskModal] = useState(false)
    const [newTaskData, setNewTaskData] = useState({
        taskName: '',
        taskDescription: '',
        tags: [],
        notes: [],
        status: 'open',
        dueDate: '',
        assignedTo:"",
    });
const [noteData,setNoteData] = useState({noteText:"",createdBy:""});




const handleShowDetails = (task) =>{
    console.log("click")
    setDisplayDetails(true)

        axios.get(`${baseUrl}/task/v1/task/${task.taskId}`)
        .then(response => {
                        setTaskProfile(response.data); // Update taskProfile with the updated data
                    })
                    .catch(error => {
                        console.error("Error Fetching Updated Task Data:", error);
                    });
                }

    

const handleAddNotes = () =>{
    const payload = noteData;
    
        const url = `${baseUrl}/task/v1/notes/${taskProfile.taskId}/`;
        axios.put(url, payload)
            .then(response => {
                setTaskProfile(response.data)
                setUpdateMessage(`Note has been added`);
                handleToast(`Note has been added`, 'success');
        //Now lets reset the input field
        setNoteData("")
    
        
})}

//update notes on use effect




    function formatDate(inputDate) {
        // Create a new Date object from the input string
        const date = new Date(inputDate);
    
        // Extract day, month, and year components from the Date object
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if the day is a single digit
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const year = date.getFullYear();
    
        // Format the components into dd/mm/yyyy format
        const formattedDate = `${day}/${month}/${year}`;
    
        return formattedDate;
    }
    

    const handleNewTaskInputChange = (event) => {
        const { name, value } = event.target;
        setNewTaskData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddNewTask = () => {
        handleNewTask(newTaskData);
        setDisplayModal({newTask:false}); // Close the modal after adding the task
    };

    const handleToast = (message, severity) => {
        setToastMessage(message);
        setToastSeverity(severity);
        setOpenToast(true);
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };


const handleNewTask = () =>{
    const tagsArray = newTaskData.tags.split(',').map(tag => tag.trim());

    const payload = {
        ...newTaskData,
        tags: tagsArray,
        notes: []
    };

    const url = `${baseUrl}/task/v1/`;
    axios.post(url, payload)
        .then(response => {
            setUpdateMessage(`New Task has been added`);
            handleToast(`New Task has been added`, 'success');
            setSelectedTask({ taskId: '', value: '' });
        })
        .catch(error => {
            console.error("Error Fetching Data:", error);
            handleToast('Failed to update task status', 'error');
        });

   }


//    const handleAddNotes = () => {
//     const payload = noteData;

//     const url = `${baseUrl}/task/v1/notes/${selectedTask.taskId}/`;
//     axios.put(url, payload)
//         .then(response => {
//             setUpdateMessage(`Note has been added`);
//             handleToast(`Note has been added`, 'success');

//             // Assuming you can fetch the updated task details directly after adding a note
//             axios.get(`${baseUrl}/task/v1/task/${selectedTask.taskId}`)
//                 .then(response => {
//                     setTaskProfile(response.data); // Update taskProfile with the updated data
//                 })
//                 .catch(error => {
//                     console.error("Error Fetching Updated Task Data:", error);
//                 });
//         })
//         .catch(error => {
//             console.error("Error Adding Note:", error);
//             handleToast('Failed to add note', 'error');
//         });
// };



const handleNewNoteInputChange = (event) => {
    const { value } = event.target;
    setNoteData((prev)=>({...prev,noteText:value,createdBy:"M. Perez"}));


};
    const changeStatus = (status,taskId) => {
        const url = `${baseUrl}/task/v1/task/${taskId}/${status}`;
        axios.put(url, [])
            .then(response => {
                setUpdateMessage(`${taskId} has been changed to ${status}`);
                handleToast(`${taskId} has been changed to ${status}`, 'success');
                setSelectedTask({ taskId: '', value: '' });
            })
            .catch(error => {
                console.error("Error Fetching Data:", error);
                handleToast('Failed to update task status', 'error');
            });
    };



    const url = `${baseUrl}/task/v1/`;
    useEffect(() => {
        axios.get(url)
            .then(response => {
                console.log(response.data);
                setData(response.data);
            })
            .catch(error => {
                console.error("Error Fetching Data:", error);
            });
    }, [updateMessage,noteData]);




    return (
        <div className="App">
              {/*  Info Modal */}
              { taskProfile  && <>
        <Dialog open={displayDetails} onClose={() => setDisplayDetails(false)}>
        <DialogTitle style={{backgroundColor:"lightblue"}}>Task Details</DialogTitle>
        <DialogContent>
            <div style ={{height:"500px", width:"700px"}}>
                <h2>{taskProfile.taskName}</h2>
                <p><span style={{fontWeight:500, marginRight:"5px"}}>Description:</span>{taskProfile.taskDescription}</p>
                <p> <span style={{fontWeight:500, marginRight:"5px"}}>Assigned To:</span> {taskProfile.assignedTo || "unknown"} on {formatDate(taskProfile.timeCreated)}</p>
                <p> Due on: {formatDate(taskProfile.dueDate) || "No Due Date"} </p>

              {taskProfile.notes && taskProfile.notes.length > 0 ? (
    <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <h4 style={{ marginBottom: '10px' }}>Notes:</h4>
        {taskProfile.notes.map((note, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', borderRadius: '5px', boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                    {formatDate(note.timeCreated)}
                </p>
                <p style={{ fontSize: '14px', color: '#555' }}>
                    {note.noteText}
                </p>
            </div>
        ))}
    </div>
) : (
    <p>No notes available.</p>
)}

                Add New Note:
                <TextField
    autoFocus
    margin="dense"
    id="notes"
    name="notes"
    label="Notes"
    type="text"
    fullWidth
    value={noteData.noteText}
    onChange={handleNewNoteInputChange}  // Ensure this is correctly set
/>

            </div>
            
          

      
        
        </DialogContent>
        <DialogActions>
                    <Button onClick={() => setDisplayModal({taskInfo:false})} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>handleAddNotes()} color="primary">
                       Add Notes
                    </Button>
                </DialogActions>
            </Dialog>
        </>}
        {/** New Modal*
 */}
              <Dialog open={displayModal.newTask} onClose={() => setDisplayModal({newTask:false,taskInfo:false})}>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>


   

                    <TextField
                        autoFocus
                        margin="dense"
                        id="taskName"
                        name="taskName"
                        label="Task Name"
                        type="text"
                        fullWidth
                        value={newTaskData.taskName}
                        onChange={handleNewTaskInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="taskDescription"
                        name="taskDescription"
                        label="Task Description"
                        type="text"
                        fullWidth
                        value={newTaskData.taskDescription}
                        onChange={handleNewTaskInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="tags"
                        name="tags"
                        label="Tags"
                        type="text"
                        fullWidth
                        value={newTaskData.tags}
                        onChange={handleNewTaskInputChange}
                    />
                
                    <TextField
                        margin="dense"
                        id="status"
                        name="status"
                        label="Status"
                        type="text"
                        fullWidth
                        value={newTaskData.status}
                        onChange={handleNewTaskInputChange}
                    />
                      <TextField
                        margin="dense"
                        id="assignedTo"
                        name="assignedTo"
                        label="Assign To"
                        type="text"
                        fullWidth
                        value={newTaskData.assignedTo}
                        onChange={handleNewTaskInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="dueDate"
                        name="dueDate"
                        label="Due Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={newTaskData.dueDate}
                        onChange={handleNewTaskInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDisplayModal({newTask:false})} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddNewTask} color="primary">
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>

            <header className="App-header">
                Dashboard
            </header>
            <div onClick={()=>setDisplayModal({newTask:true})} class="add-button">
    <span class="plus-sign">+</span>
    <span class="button-text">Add</span>
  </div>
            <Box display="flex" flexDirection={"column"} justifyContent="center" alignItems="center" p={5}>
                {data.map(task => (
                    <Card style={{textDecoration: task.status === "close"?"line-through":""}}
                    key={task.taskId} sx={{ display: "flex", width: "100%", margin: 1 }}>
                        <CardContent ><div 
                         onClick={()=>{
                            handleShowDetails(task)
            
                        }}
                        style={{display:"flex", flexDirection:"column"}}>
                            <div>
                            {formatDate(task.timeCreated)} 
                            </div >
                            <Typography 
                             style={{
                                display: 'inline-block',
                                backgroundColor: 'green',
                                color: '#ffffff',
                                padding: '5px 10px',
                                borderRadius: '16px',
                                marginRight: '10px',
                                marginBottom: '10px',
                                fontSize: '14px',
                            }}
                            variant="p">
                            {task.assignedTo}
                            </Typography>
                            
                            </div>  </CardContent>
                        <CardContent  onClick={()=>{
                                    handleShowDetails(task)                    }}>
                            <Typography variant="h5" component="div">
                                {task.taskName}
                            </Typography>
                        </CardContent>
                        <CardContent>
                            {task.tags.map((tag, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'inline-block',
                                        backgroundColor: '#007bff',
                                        color: '#ffffff',
                                        padding: '5px 10px',
                                        borderRadius: '16px',
                                        marginRight: '10px',
                                        marginBottom: '10px',
                                        fontSize: '14px',
                                    }}
                                >
                                    {tag}
                                </div>
                            ))}
                        </CardContent>
                        <CardContent>
                            {task.status === "open" && (
                                <div onClick={() => {
                                    handleShowDetails(task)                              
                                }}>
                                    <CheckBoxOutlineBlankIcon />
                                </div>
                            )}
                            {task.status === "close" && (
                                <div onClick={() => {
                                    setSelectedTask({ taskId: task.taskId, value: "" });
                                    changeStatus("open",task.taskId);
                                }}>
                                    <CheckBoxIcon />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                <Snackbar
                style={{padding:"80px"}}
                    open={openToast}
                    autoHideDuration={1000}
                    onClose={handleCloseToast}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={handleCloseToast}
                        severity={toastSeverity}
                    >
                        {toastMessage}
                    </MuiAlert>
                </Snackbar>
            </Box>
        </div>
    );
}

export default Dashboard;