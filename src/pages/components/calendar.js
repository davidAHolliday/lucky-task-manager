import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

function ServerDay(props) {
  const {  highlightedDays = [], day, outsideCurrentMonth, onDayClick, ...other } = props;

  const isSelected =
    !outsideCurrentMonth && highlightedDays.indexOf(day.date()) >= 0;

  const handleClick = () => {
    onDayClick(day); // Pass the clicked day to the parent component
  };

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "!" : undefined}
      color="success"
      onClick={handleClick} // Trigger the click event
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function DateCalendarServerRequest({ resetDate,data, handleDayClick }) {
    const requestAbortController = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [highlightedDays, setHighlightedDays] = React.useState([]);
    const [selectedDay, setSelectedDay] = React.useState(null);
  
    let datesList = [];
  
    if (data) {
      // Check if data is defined before attempting to iterate over it
      data.forEach((task) => {
        const date = task.dueDate;
        datesList.push(date);
      });
    }
  
    React.useEffect(() => {
      const initialDate = dayjs();
      fetchHighlightedDays(initialDate);
      // abort request on unmount
      return () => requestAbortController.current?.abort();
    }, [data]);
  
    const fetchHighlightedDays = (date) => {
      setTimeout(() => {
        const currentMonth = date.month() + 1;
  
        const parsedDates = datesList
          .filter((dateString) => dayjs(dateString).month() + 1 === currentMonth)
          .map((dateString) => dayjs(dateString).date());
  
        setHighlightedDays(parsedDates);
        setIsLoading(false);
      }, 1000);
    };
  
    const handleMonthChange = (date) => {
      if (requestAbortController.current) {
        requestAbortController.current.abort();
      }
  
      setIsLoading(true);
      setHighlightedDays([]);
      fetchHighlightedDays(date);
    };
  

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          loading={isLoading}
          onMonthChange={handleMonthChange}
          selected
          slots={{
            day: (props) => (
              <ServerDay {...props} onDayClick={handleDayClick} />
            ),
          }}
          slotProps={{
            day: {
              highlightedDays,
            },
          }}
        />
        <div>
         <button onClick={()=>{
            resetDate() 
         }}>Reset Date Filter</button>
        </div>
      </LocalizationProvider>
    );
  }