import { useHotkeys } from "react-hotkeys-hook";

import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { useRef } from "react";

const { PUBLIC_GOOGLE_CALENDAR_ID, PUBLIC_GOOGLE_CALENDAR_API_KEY } =
  import.meta.env;

const Calendar = () => {
  const calendarRef = useRef(null);

  useHotkeys("ArrowLeft", () => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
  });

  useHotkeys("ArrowRight", () => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
  });

  useHotkeys("t", () => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  });

  return (
    <FullCalendar
      plugins={[listPlugin, googleCalendarPlugin]}
      initialView="listMonth"
      contentHeight={"auto"}
      // googleCalendarApiKey="AIzaSyC-NUPVkH4jRq8y8JEhIHShE2RJhXrOaEg"
      events={{
        googleCalendarId: PUBLIC_GOOGLE_CALENDAR_ID,
        googleCalendarApiKey: PUBLIC_GOOGLE_CALENDAR_API_KEY,
      }}
      ref={calendarRef}

      // events={{
      //   googleCalendarId:
      //     "sojourners.church_jsgg63tl85edr0sceapunke178@group.calendar.google.com",
      //   googleCalendarApiKey: "AIzaSyC-NUPVkH4jRq8y8JEhIHShE2RJhXrOaEg",
      // }}
      // eventClassNames={"hover:[&_a]:!decoration-primary"}
      // viewClassNames={"[&_.fc_h2]:text-yellow-500"}
    />
  );
};

export default Calendar;
