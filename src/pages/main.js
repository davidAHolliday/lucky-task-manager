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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import { Delete, DeleteForever } from "@mui/icons-material";




function Dashboard() {
    const [data, setData] = useState([]);
    const [updateMessage, setUpdateMessage] = useState('');
    const [selectedTask, setSelectedTask] = useState();
    const [selectedForDelete,setSelectedForDelete] = useState()
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('success');
    const [displayModal, setDisplayModal] = useState({newTask:false})
    const [taskProfile, setTaskProfile] = useState(); 
    const [displayDetails, setDisplayDetails] = useState(false)
    const [filterValue, setFilterValue] = useState("All"); // The selected user or tag to filter by
    const [tagValue, setTagValue] = useState("All"); // The selected user or tag to filter by
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState(data); // Initially set to all tasks
    const [switchState, setSwitchState] = useState(true)
    const [deletedItemResponse, setDeletedItemResponse] = useState();




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


const users = [...new Set(data.map(task => task.assignedTo))]; // Unique assigned users




const handleTagClick = (tag) => {
    setTagValue(tag);
};

const handleShowDetails = (task) =>{
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
        setNoteData({noteText:""})
    
        
})}

//update notes on use effect


    const handleToggle = (event) => {
        setSwitchState(event.target.checked);
      };
      
  



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

        //Reset Data
    setNewTaskData({
        taskName: '',
        taskDescription: '',
        tags: [],
        notes: [],
        status: 'open',
        dueDate: '',
        assignedTo:"",
    })

   }

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


//Fetches Data
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
    }, [updateMessage,noteData,deletedItemResponse]);


      const tags = ["All",...new Set(data.flatMap(task => task.tags))]; // Unique tags across all tasks
    
      useEffect(() => {
        if (data.length > 0) {
            let filtered = []; // Declare the filtered array outside of conditional blocks
    
            // Filter tasks based on the selected user (filterValue) and status
            if (filterValue === "All") {
                if (switchState) {
                    filtered = data.filter(task => task.status === "open");
                } else {
                    filtered = [...data]; // Copy all tasks if switchState is false
                }
            } else {
                if (switchState) {
                    filtered = data.filter(task => task.assignedTo === filterValue && task.status === "open");
                } else {
                    filtered = data.filter(task => task.assignedTo === filterValue);
                }
            }
    
            // If a tagValue is selected, further filter the tasks by the selected tag
            if (tagValue !== "All") {
                filtered = filtered.filter(task => task.tags.includes(tagValue));
            }
    
            // Sort the tasks by due date
            const sortedTasks = filtered.sort((a, b) => {
                const dateComparison = new Date(a.dueDate) - new Date(b.dueDate);
                return dateComparison;
            });
    
            // Update the filtered tasks state
            setFilteredTasks([...sortedTasks]);
        }
    }, [filterValue, tagValue, data, switchState]); // Include tagValue in the dependency array
    
    const handleTaskDelete = (id) => {
        setSelectedForDelete(id);
        // Display the delete confirmation modal
        setShowDeleteConfirmation(true);
    };


    const deleteNote = (noteId) => {
        // Perform the delete action here
        // You can call your delete API endpoint or any logic needed
        const url = `${baseUrl}/task/v1/note/${taskProfile.taskId}/${noteId}`;
        axios.delete(url)
            .then(response => {
                // setDeletedItemResponse(response.data)
                setTaskProfile(response.data)
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error Fetching Data:", error);
            });
    };



    const confirmDelete = () => {
        // Perform the delete action here
        // You can call your delete API endpoint or any logic needed
        const url = `${baseUrl}/task/v1/task/${selectedForDelete}`;
        axios.delete(url)
            .then(response => {
                setDeletedItemResponse(response.data)
                console.log(response.data);
                handleCloseDeleteConfirmation(); // Close the confirmation modal after successful delete
            })
            .catch(error => {
                console.error("Error Fetching Data:", error);
            });
    };

    
    const handleCloseDeleteConfirmation = () => {
        // Close the delete confirmation modal
        setShowDeleteConfirmation(false);
    };

    


    return (
        <div className="App">
       
                <FormControl component="fieldset" variant="standard">
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={switchState} onChange={handleToggle} name="Open" />
          }
          label="Show Open Only"
        />
      </FormGroup>
    </FormControl>

 {/* Delete Confirmation Modal */}
 <Dialog open={showDeleteConfirmation} onClose={handleCloseDeleteConfirmation}>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this task?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteConfirmation} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={confirmDelete} color="primary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>



              {/*  Info Modal */}
              { taskProfile  && <>
        <Dialog open={displayDetails} onClose={() => setDisplayDetails(false)}>
        <DialogTitle style={{backgroundColor:"lightblue"}}>Task Details</DialogTitle>
        <DialogContent>
            <div style ={{height:"500px", width:"300px"}}>
                <h2>{taskProfile.taskName}</h2>
                <p><span style={{fontWeight:500, marginRight:"5px"}}>Description:</span>{taskProfile.taskDescription}</p>
                <p> <span style={{fontWeight:500, marginRight:"5px"}}>Assigned To:</span> {taskProfile.assignedTo || "unknown"} on {formatDate(taskProfile.timeCreated)}</p>
                <p> Due on: {formatDate(taskProfile.dueDate) || "No Due Date"} </p>

              {taskProfile.notes && taskProfile.notes.length > 0 ? (
    <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <h4 style={{ marginBottom: '10px' }}>Notes:</h4>
        {taskProfile.notes.map((note, index) => (
    <div 
        key={index} 
        style={{ 
            display: 'flex',  // Make it a flex container
            justifyContent: 'space-between',  // Align items to the far ends
            marginBottom: '15px', 
            padding: '10px', 
            borderRadius: '5px', 
            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)', 
            backgroundColor: '#f9f9f9' 
        }}
    >
        <div>
            <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                {formatDate(note.timeCreated)}
            </p>
            <p style={{ fontSize: '14px', color: '#555' }}>
                {note.noteText}
            </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <DeleteForever onClick={()=>{deleteNote(note.noteId)}}/>  {/* This will be positioned at the far right */}
        </div>
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
    style={{ width: '100%' }}  // <-- Set the width using inline styles
    value={noteData.noteText}
    onChange={handleNewNoteInputChange}  // Ensure this is correctly set
/>

            </div>
            
        
        
        </DialogContent>
        <DialogActions>
                    <Button onClick={() => setDisplayDetails(false)} color="primary">
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

  <div className="filter-container">
  <Select
    value={filterValue}
    onChange={(e) => setFilterValue(e.target.value)}
    variant="outlined" // optional, gives an outlined appearance
    style={{ width: '100%' }} // optional, adjust as per your design needs
>
    <MenuItem value={"All"}>All</MenuItem>
    {users.map((user, index) => (
        <MenuItem key={index} value={user}>
            {user}
        </MenuItem>
    ))}
</Select>



</div>

<div style={{ 
    height: "auto",
    backgroundColor: "blue", 
    display: "flex", 
    flexWrap: "wrap",
    justifyContent: "center", 
    alignItems: "center",
    width: "100%",
    overflowX: "auto"
}}>
    {tags.map((tag, index) => {
        const colors = ["#FFCCCC", "#CCFFCC", "#CCCCFF", "#FFCCFF", "#FFFFCC", "#CCFFFF"];
        const color = colors[index % colors.length];
        
        const tagStyle = {
            opacity:tag==tagValue ?"100%":"60%",
            backgroundColor: color,
            padding: "5px 10px",
            margin: "5px",
            borderRadius: "5px",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer"  // Add cursor pointer to indicate clickable
        };

        return (
            <div 
                key={index} 
                style={tagStyle}
                onClick={() => handleTagClick(tag)} // Handle tag click
            >
                {tag}
            </div>
        );
    })}
</div>
  
            <Box style={{ padding: 0}}    width={"100%"} paddin
             display="flex" flexDirection={"column"} justifyContent="center" alignItems="center" p={5}>
                {filteredTasks.map(task => (
                    <Card style={{textDecoration: task.status === "close"?"line-through":""}}
                    key={task.taskId} sx={{ display: "flex", minWidth: "100%", margin: 1 }}>
                        <CardContent style={{width:"20%"}}>
                            <div  
                                onClick={()=>{
                                handleShowDetails(task)}}

                        style={{display:"flex", flexDirection:"column"}}>
                            <div style={{marginBottom:"5px"}}>
                            Due {formatDate(task.dueDate)} 
                            </div  >
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
                            
                            </div>  
                            </CardContent>
                        <CardContent  style={{width:"30%"}}
                        onClick={()=>{
                                    handleShowDetails(task)                    }}>
                            <Typography variant="h5" component="div">
                                {task.taskName}
                            </Typography>
                        </CardContent>
                        <CardContent style={{width:"30%"}}>
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
                        <CardContent style={{width:"20%"}}>
                            {task.status === "open" && (
                                  <div onClick={() => {
                                    setSelectedTask({ taskId: task.taskId, value: "" });
                                    changeStatus("close",task.taskId);
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
                           <Delete style={{marginTop:"20px"}} onClick={()=>handleTaskDelete(task.taskId)}/>
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