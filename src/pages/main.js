import React, { useState, useEffect } from "react";
import axios, { HttpStatusCode } from "axios";
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, CardActionArea, CardContent, formLabelClasses  } from "@mui/material";
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
import { Delete, DeleteForever, ExpandMoreOutlined } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DateCalendarServerRequest, { CalendarWidget, ServerDay } from "./components/calendar";
import dayjs from "dayjs";
import CameraComponent from "./components/camera-component";
import ImageComponent from "./components/loadImage";
import CameraAltIcon from '@mui/icons-material/CameraAlt';




function Dashboard() {
    const [data, setData] = useState([]);
    const [updateMessage, setUpdateMessage] = useState('');
    const [selectedTask, setSelectedTask] = useState();
    const [selectedForDelete,setSelectedForDelete] = useState()
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('success');
    const [displayNewTaskModal, setDisplayNewTaskModal] = useState(false)
    const [displayEditModal, setDisplayEditModal] = useState(false)
    const [taskProfile, setTaskProfile] = useState(); 
    const [displayDetails, setDisplayDetails] = useState(false)
    const [filterValue, setFilterValue] = useState("All"); // The selected user or tag to filter by
    const [tagValue, setTagValue] = useState("All"); // The selected user or tag to filter by
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState(data); // Initially set to all tasks
    const [switchState, setSwitchState] = useState(true)
    const [deletedItemResponse, setDeletedItemResponse] = useState();
    const [expanded, setExpanded] = useState(false); // State to manage accordion's open/close state
    const [customTag,setCustomTag] = useState(null);
    const [displayChecklist,setDisplayChecklist] = useState(false)
    const [date,setDate] = useState(null);
    const [viewCount, setViewCount] = useState(15);
    const [showCamModal, setShowCamModal] = useState(false)
    const [checkListIndex,setChecklistIndex] = useState();

    const tagContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center', // Center align tags horizontally
    };

    const tagStyle = {
        margin: '5px',
        flex: '0 0 30%', // 30% width for each tag box
        cursor: 'pointer',
    };


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
const [checklistData,setChecklistData] = useState({itemText:"",index:null,doneStatus:false})


const users = [...new Set(data.map(task => task.assignedTo))]; // Unique assigned users


const handleAccordionChange = () => {
    setExpanded((prevExpanded) => !prevExpanded); // Toggle accordion state
};


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

const handleNewChecklistSubmit = ()=>{
    const payload = checklistData;

    if(checklistData.itemText){
        const url = `${baseUrl}/task/v1/checklist/${taskProfile.taskId}`;
        axios.put(url, payload)
            .then(response => {
                setTaskProfile(response.data)
        //Now lets reset the input field
        setChecklistData({itemText:"",index:null,doneStatus:false})
    })


    }
    
  
    

}

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
        const formattedDate = `${month}/${day}/${year}`;
    
        return formattedDate;
    }
    

    const handleNewTaskInputChange = (event) => {
        const { name, value } = event.target;
        setNewTaskData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleMultipleTagInputChange = (event, newValue) => {
        const tags = newValue; // newValue will be an array of selected tags
       console.log("from method",tags)
        setNewTaskData(prevState => ({
            ...prevState,
            tags: tags // Update the tags field with the selected tags array
        }));
    };

    const handleAddNewTask = () => {
        handleNewTask(newTaskData);
        setDisplayNewTaskModal(false); // Close the modal after adding the task
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

    const calculateUrgency = (timeCreatedISO, dueDateISO) => {
        const timeCreated = new Date(timeCreatedISO);
        const dueDate = new Date(dueDateISO);
        const today = new Date();
      
      
        if (dueDate < today) {
          return 'Past Due';
        } else if (dueDate.getDate() - today.getDate() === 0) {
          return 'Due Today';
        }
        else if (dueDate.getDate() - today.getDate() === 1) {
            return 'Due Tomorrow';
          }
          else if (dueDate.getDate() - today.getDate() === 2) {
            return 'Due in 2 Days';
        } else if (dueDate.getDate() - today.getDate() === 3) {
          return 'Due in 3 Days';
        } else if (dueDate.getDate() - today.getDate() === 4) {
            return 'Due in 4 Days';
        } else if (dueDate.getDate() - today.getDate() === 5) {
            return 'Due in 5 Days';
        } else if (dueDate.getDate() - today.getDate() === 6) {
            return 'Due in 6 Days';
        } else if (dueDate.getDate() - today.getDate() == 7) {
          return 'Due in a Week';
        } else {
          return '';
        }
      };
      
      // Example usage with ISO 8601 formatted date strings:
      const timeCreatedISO = "2024-01-01T02:58:23.293+00:00"; // Replace with the actual time created
      const dueDateISO = "2024-01-09T02:58:23.293+00:00"; // Replace with the actual due date
      console.log(calculateUrgency(timeCreatedISO, dueDateISO)); // Output will categorize the item based on its due date relative to the current date
      
      



const handleNewTask = () =>{
    let tagsToAdd = [...newTaskData.tags]; // Use spread operator to create a new array
   
    if(customTag){
        console.log("hitting custom tag")
        const customArray = customTag.split(","); 
        const trimmedArray = customArray.map(tag => tag.trim());
        tagsToAdd.push(...trimmedArray);

    }

    

    const payload = {
        ...newTaskData,
        tags: tagsToAdd,
        notes: [],
        checkListItems: []
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
        checkListItems:[],
        status: 'open',
        dueDate: '',
        assignedTo:"",
    })

    setCustomTag(null)

   }

const handleNewNoteInputChange = (event) => {
    const { value } = event.target;
    setNoteData((prev)=>({...prev,noteText:value,createdBy:"M. Perez"}));


};


 const handleAddCheckListChange = (event,index)=>{
    const { value } = event.target;
    setChecklistData((prev)=>({index:index,itemText:value,doneStatus:false}));


 }
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
    }, [updateMessage,noteData,deletedItemResponse,checklistData]);


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

            if (date !== null) {
                filtered = filtered.filter(task => {

                    const taskDueDate = dayjs(task.dueDate)
                console.log(taskDueDate.format('YYYY-MM-DD'),date)
                   return  taskDueDate.format('YYYY-MM-DD') === date;
                    
                });
            }
    
            // Sort the tasks by due date
            const sortedTasks = filtered.sort((a, b) => {
                const dateComparison = new Date(a.dueDate) - new Date(b.dueDate);
                return dateComparison;
            });

    
            
    
      
    
            // Update the filtered tasks state
            setFilteredTasks([...sortedTasks]);
        }
    }, [filterValue, tagValue, data, switchState,date]); // Include tagValue in the dependency array
    
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

    const handleEditTask =(taskProfile)=>{
        setDisplayDetails(false)        //Set Existing Data
        setNewTaskData(taskProfile);
        //Pop Up Edit Data Modal
        setDisplayEditModal(true)
    }


const handleCheckboxChange = (index,status) =>{
    
    const url = `${baseUrl}/task/v1/checklist/${taskProfile.taskId}/${index}/${!status}`;
    axios.put(url, [])
        .then(response => {
            setUpdateMessage(`Marked Done`);
            setTaskProfile(response.data)

        })
        .catch(error => {
            console.error("Error Fetching Data:", error);
            handleToast('Failed to update task status', 'error');
        });

}

    const handleEditSubmit = (id) =>{
        let tagsToAdd = [...newTaskData.tags]; // Use spread operator to create a new array
       
        if(customTag){
            console.log("hitting custom tag")
            const customArray = customTag.split(","); 
            const trimmedArray = customArray.map(tag => tag.trim());
            tagsToAdd.push(...trimmedArray);
    
        }
    
        const payload = {
            ...newTaskData,
            tags: tagsToAdd,
            notes: []
        };

           
 
        const url = `${baseUrl}/task/v1/task/update/${id}`;
        axios.put(url, payload)
            .then(response => {
                setUpdateMessage(`New Task has been Updated`);
                handleToast(`New Task has been added`, 'success');
                setSelectedTask({ taskId: '', value: '' });
                setDisplayEditModal(false)
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
    
        setCustomTag(null)
    
       }


       const handleNavigate =()=>{
        window.location.href = '/guest-projections'
       }

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

    const handleAddTag = () => {
        // Get the current value from the TextField
        const newTag = newTaskData.tags; // Trim to remove any leading or trailing white spaces
        
        // Check if the newTag is not empty
        if (newTag) {
            // Check if the tag already exists in the array
            if (!newTaskData.tags.includes(newTag)) {
                // Add the new tag to the tags array
                setNewTaskData(prevState => ({
                    ...prevState,
                    tags: [...prevState.tags, newTag]
                }));
            } else {
                // Optional: Display a message or alert that the tag already exists
                alert('Tag already exists!');
            }
            
            // Clear the TextField after adding the tag
            setNewTaskData(prevState => ({
                ...prevState,
                tags: '', // Clear the tags TextField
            }));
        }
    };


    const handleDayClick = (clickedDay) => {
        console.log('Clicked day:', clickedDay.format('YYYY-MM-DD'));
        setDate(clickedDay.format('YYYY-MM-DD'));
      };

const resetDate = ()=>{
    setDate(null)
}

const extendedView =()=>{
    if(viewCount === 50){
        setViewCount(15)
    }
    setViewCount(50)

}

    return (
        <> {false ? <div style={{display:"flex" , flexDirection:"column"}}><CircularProgress />
        <div>Loading</div>
        </div> :
        <div className="App">
  {showCamModal && (
         <Dialog open={showCamModal} onClose={()=>setShowCamModal(false)} style={{ width:"90%",zIndex: 2000 }}>
         <div
           style={{
         
           }}
         >
           {/* <CameraComponent taskProfile={taskProfile} index={checkListIndex} showCamModal={setShowCamModal} /> */}
           <button onClick={()=>setShowCamModal(false)} style={{ marginTop: '10px' }}>Close Camera Modal</button>
         </div>
       </Dialog>
      )}

      
       <FormControl component="fieldset" variant="standard">
  <FormGroup>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FormControlLabel
        control={
          <Switch checked={switchState} onChange={handleToggle} name="Open" />
        }
        label="Show Open Only"
      />
      <div onClick={()=>{
        handleNavigate();}}
        

       style={{ marginLeft: 'auto' }}>
        <TrendingUpIcon/>
      </div>
    </div>
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
              {( taskProfile && displayDetails)  && <>
        <div className="task-modal" >
        <div className="task-modal-title" >Task Details</div>
        <div className="task-modal-content" >
            <div onClick={()=>{
                handleEditTask(taskProfile)
                setDisplayNewTaskModal(false)}}style={{marginTop:"25px",color:"blue"}}>Edit</div>
            <div className="task-modal-content-container" >
                <h2>{taskProfile.taskName}</h2>
                <p><span style={{fontWeight:500, marginRight:"5px"}}>Description:</span>{taskProfile.taskDescription}</p>
                <p> <span style={{fontWeight:500, marginRight:"5px"}}>Assigned To:</span> {taskProfile.assignedTo || "unknown"} on {formatDate(taskProfile.timeCreated)}</p>
                <p> <span style={{fontWeight:500, marginRight:"5px"}}>Tags:</span>   {taskProfile.tags.map((tag, index) => (
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
                                        fontSize: '12px',
                                    }}
                                >
                                    {tag}
                                </div>
                            ))}</p>

                <p> Due on: {formatDate(taskProfile.dueDate) || "No Due Date"} </p>

                <div 
                style={{ 
                    height: '50px', 
                    backgroundColor: '#007bff', 
                    color:"#fff",
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                    borderBottom: '1px solid #ccc' // Add border to separate the dropdown bar from the content below
                }} 
                onClick={() => setDisplayChecklist(prev => !prev)} // Toggle dropdown visibility on click
            >
                <span style={{marginRight:"10px"}}>Checklist</span> <ArrowDropDownCircleIcon/>
            </div>
            {displayChecklist &&<> 
    <div className="task-main-container" >
    {taskProfile.checkListItems.map((item, index) => {
    const strikeout = item.doneStatus ? "line-through" : "none";
    return (
        <div 
            key={index} 
          className="check-list-map" 
        >
            <div className="check-list-name">
                <p 
                style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333', textDecoration: strikeout }}
                >
                    {index} {item.itemText}
                </p>
                <input 
                    type="checkbox" 
                    checked={item.doneStatus}
                    onChange={(e) => handleCheckboxChange(index + 1, item.doneStatus)}
                />
              
            </div>
            <div className="image-box">
                    <ImageComponent data={item.photo} index={index} /> 
                <CameraAltIcon onClick={() => {
                    setShowCamModal(true);
                    setChecklistIndex(index)}}/>
                   
                   
              
                </div>
            <div>
          
            </div>
        </div>
    );
})}

<div className="add-to-list-input" >
    {/* TextField Component */}
    <TextField
        autoFocus
        margin="dense"
        id="clItem"
        name="clItem"
        label="Add Item To List"
        type="text"
        style={{ flex: 1, marginRight: '10px', height: '50px', width:"80%" }}  // Set flex and height properties
        value={checklistData.itemText}
        onChange={(val)=>handleAddCheckListChange(val,taskProfile.checkListItems.length+1)}  // Ensure this is correctly set
    />
    
    {/* Button Component */}
    <button onClick={handleNewChecklistSubmit}
        style={{ 
            marginTop:"5px",
            height: '50px',  // Set the height to match the TextField height
            padding: '0 20px',  // Add padding for better aesthetics
            backgroundColor: '#007bff',  // Example background color
            color: '#fff',  // Example text color
            border: 'none',  // Remove border
            borderRadius: '5px',  // Add border radius for rounded corners
            cursor: 'pointer'  // Add pointer cursor on hover
        }}
    >
        +
    </button>
</div>

    </div>




 </>}



              

    
              {taskProfile.notes && taskProfile.notes.length > 0 ? (
    <div style={{ width:"80vw", marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        {/* <h4 style={{ marginBottom: '10px' }}>Notes:</h4> */}
        
        {taskProfile.notes.map((note, index) => (
    <div 
        key={index} 
       className="notes-card"
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
            
        
        
        </div>
        <DialogActions>
                    <Button onClick={() => setDisplayDetails(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>handleAddNotes()} color="primary">
                       Add Notes
                    </Button>
                </DialogActions>
            </div>
        </>}
        {/** New Modal*
 */}
              <Dialog open={displayNewTaskModal} onClose={() => setDisplayNewTaskModal(false)}>
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
          
        
<Autocomplete
                multiple
                id="tags-outlined"
                options={tags}
                freeSolo // Allows the user to add tags that are not in the existing list
                value={newTaskData.tags}
                onChange={handleMultipleTagInputChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        margin="dense"
                        id="tags"
                        name="tags"
                        label="Tags"
                        type="text"
                        fullWidth
                        variant="outlined"

                    />
                )}
            />
            <TextField
                        margin="dense"
                        id="tags"
                        name="tags"
                        label="Custom Tag (Seperate by comma)"
                        type="text"
                        fullWidth
                        value={customTag}
                        onChange={val=>setCustomTag(val.target.value)}
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
                    <Button onClick={() => setDisplayNewTaskModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddNewTask} color="primary">
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>

              {/** Update task Modal*
 */}
              <Dialog open={displayEditModal} onClose={() => setDisplayEditModal(false)}>
                <DialogTitle>Edit Task</DialogTitle>
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
          
        
<Autocomplete
                multiple
                id="tags-outlined"
                options={tags}
                freeSolo // Allows the user to add tags that are not in the existing list
                value={newTaskData.tags}
                onChange={handleMultipleTagInputChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        margin="dense"
                        id="tags"
                        name="tags"
                        label="Tags"
                        type="text"
                        fullWidth
                        variant="outlined"

                    />
                )}
            />
            <TextField
                        margin="dense"
                        id="tags"
                        name="tags"
                        label="Custom Tag (Seperate by comma)"
                        type="text"
                        fullWidth
                        value={customTag}
                        onChange={val=>setCustomTag(val.target.value)}
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
                        value={ newTaskData.dueDate ? newTaskData.dueDate.split('T')[0] : ''}
                        onChange={handleNewTaskInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDisplayEditModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>handleEditSubmit(newTaskData.taskId)} color="primary">
                        Update Task
                    </Button>
                </DialogActions>
            </Dialog>

            <header className="App-header">
                Dashboard
            </header>
            <div onClick={()=>setDisplayNewTaskModal(true)} class="add-button">
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
    
    <div>
    <Accordion expanded={expanded} onChange={handleAccordionChange} style={{ width: '100%' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreOutlined />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    Tags:  {tagValue}
                </AccordionSummary>
                <AccordionDetails>
                    <div style={tagContainerStyle}>
                        {tags.map((tag, index) => {
                            const colors = ["#FFCCCC", "#CCFFCC", "#CCCCFF", "#FFCCFF", "#FFFFCC", "#CCFFFF"];
                            const color = colors[index % colors.length];
                            
                            const individualTagStyle = {
                                ...tagStyle,
                                backgroundColor: color,
                                padding: '5px 10px',
                                borderRadius: '5px',
                                color: 'black',
                                fontWeight: 'bold',
                                opacity: tag === tagValue ? '100%' : '60%',
                            };

                            return (
                                <div 
                                    key={index} 
                                    style={individualTagStyle}
                                    onClick={() =>{
                                         handleTagClick(tag)
                                    setExpanded(false)}} // Handle tag click
                                >
                                    {tag}
                                </div>
                            );
                        })}
                    </div>
                </AccordionDetails>
            </Accordion>        </div>
</div>
<DateCalendarServerRequest resetDate={resetDate}handleDayClick={handleDayClick} data={filteredTasks} date={date}/>
  
            <Box  className = "task-box"
                >
                {filteredTasks.slice(0,viewCount).map((task, index) => (
                    <>
                    <Card
                    className="task-box-card"
                     style={{backgroundColor:index % 2 ==0? "#C4D4E0":"",textDecoration: task.status === "close"?"line-through":""}}
                    key={task.taskId} sx={{ display: "flex", margin: 1 }}>
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
                        <CardContent  style={{width:"60%"}}
                        onClick={()=>{
                                    handleShowDetails(task)                    }}>
                            <Typography variant="h5" component="div">
                                {task.taskName}
                            </Typography>
                        </CardContent>
                        {/* <CardContent style={{width:"30%"}}>
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
                        </CardContent> */}
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
                  {  task.status == "open" && <div 
                  className="status-banner"
  style={{

    backgroundColor: calculateUrgency(task.timeCreated, task.dueDate) === "Due in a Week" ? "#FFF59D" :
                     calculateUrgency(task.timeCreated, task.dueDate) === "Due in 6 Days" ? "#FFCC80" :
                     calculateUrgency(task.timeCreated, task.dueDate) === "Due in 5 Days" ? "#FFB74D" :
                     calculateUrgency(task.timeCreated, task.dueDate) === "Due in 4 Days" ? "#FFA726" :
                     calculateUrgency(task.timeCreated, task.dueDate) === "Due in 3 Days" ? "#FF8F00" :
                     calculateUrgency(task.timeCreated, task.dueDate) === "Due in 2 Days" ? "#FF6F00" :
                     calculateUrgency(task.timeCreated, task.dueDate) === "Due Tomorrow" ? "#E65100" :
                     calculateUrgency(task.timeCreated, task.dueDate) === "Due Today" ? "#E65100" :
                     calculateUrgency(task.timeCreated, task.dueDate) === "Past Due" ? "#D32F2F" : "",
    color: calculateUrgency(task.timeCreated, task.dueDate) === "Past Due" ? "white" : "black" // Adjust text color based on urgency
  }}
>
  {calculateUrgency(task.timeCreated, task.dueDate)}
</div>
}
</>
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
            <button onClick={()=>extendedView()} style={{width:"100%"}}>Extend/Minimize View</button>

        </div>
        }</>
    );
}

export default Dashboard;