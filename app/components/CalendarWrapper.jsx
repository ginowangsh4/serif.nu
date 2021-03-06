import React from 'react';
import { Card, CardText, CardTitle } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List } from 'immutable';

import Calendar from './Calendar.jsx';
import Unscheduled from './Unscheduled.jsx';
import { matchId } from '../helpers';
import CalendarHeader from './CalendarHeader.jsx';

const style = {
  card: {
    margin: 10
  },
  dialogContent: {
    marginTop: '24px'
  }
};

const CalendarWrapper = ({
  currentTerm,
  coursecomps,
  selectEvent,
  eventOpen,
  selectedEvents,
  currentCalendarName,
  currentTermName,
  remove,
  closeDialog,
  swapComponent,
  sections,
  components,
  hoverSection,
  hoverComponent,
  setCalendarName,
  handleAuth,
  facebookPosted,
  regalSent,
  hasRegal
}) => {
  // Separate unschedule courses from scheduled ones
  const unscheduled = [];
  const scheduled = [];
  coursecomps.forEach((coursecomp) => {
    if (coursecomp.unscheduled) {
      unscheduled.push(coursecomp);
    } else {
      scheduled.push(coursecomp);
    }
  });
  // Add hover classes to appropriate lists
  if (hoverSection) {
    if (hoverSection.unscheduled) unscheduled.push(hoverSection);
    else scheduled.push(hoverSection);
  } else if (hoverComponent) {
    if (hoverComponent.unscheduled) unscheduled.push(hoverComponent);
    else scheduled.push(hoverComponent);
  }

  const selected = selectedEvents.section;
  const selectedComponent = selectedEvents.component;
  const removeButton = (
    <FlatButton
      label="Remove"
      primary
      onTouchTap={() => remove(selected.id)}
    />
  );
  const cancelButton = (
    <FlatButton
      label="Cancel"
      primary
      onTouchTap={() => closeDialog()}
    />
  );
  const swapButton = (
    <FlatButton
      label="Swap Component"
      primary
      onTouchTap={() => swapComponent(currentTerm, selected.school, selected.subject, selected.course, selected.id)}
    />
  );
  // Prepare action buttons for event click dialog
  const actions = [];
  actions.push(removeButton);
  // Swap components button only available if clicked class has components
  if (selectedComponent) actions.push(swapButton);
  actions.push(cancelButton);

  const component = selected ? components.filter(matchId(selected.id))[0] : null;

  return (
    <div>
      <Card style={style.card}>
        <CardText>
          <CalendarHeader
            currentCalendarName={currentCalendarName}
            setCalendarName={setCalendarName}
            handleAuth={handleAuth}
            hasClasses={sections.size !== 0}
            currentTermName={currentTermName}
            facebookPosted={facebookPosted}
            sections={sections}
            components={components}
            regalSent={regalSent}
            hasRegal={hasRegal}
          />
          <Calendar
            coursecomps={scheduled}
            selectEvent={selectEvent}
            sections={sections}
            components={components}
          />
        </CardText>
      </Card>

      <Card style={style.card}>
        <CardTitle title="Unscheduled Courses" />
        <CardText>
          {unscheduled.map((event) => (
            <Unscheduled
              key={event.id}
              id={event.id}
              title={event.title}
              color={event.color}
              sections={sections}
              components={components}
              selectEvent={selectEvent}
            />
          ))}
        </CardText>
      </Card>

      {selected && ( // Dialog that appears on event select
        <Dialog
          title={`${selected.subject} ${selected.course} ${selected.name} -- Section ${selected.section}`}
          actions={actions}
          open={eventOpen}
          onRequestClose={() => closeDialog()}
          autoScrollBodyContent
        >
          <p style={style.dialogContent}>{selected.meeting_time}</p>
          <p>{selected.location}</p>
          <p>{selected.instructor.join(', ')}</p>
          {selected.topic && <p>{selected.topic}</p>}
          <p>{selected.overview_of_class}</p>
          <p>ID: {selected.id}</p>
          {component && (
            <div>
              <h4>{component.component}</h4>
              <p>{component.meeting_time}</p>
              <p>{component.room}</p>
            </div>
          )}
        </Dialog>
      )}
    </div>
  );
};

export default CalendarWrapper;

CalendarWrapper.propTypes = {
  currentTerm: React.PropTypes.string,
  coursecomps: React.PropTypes.arrayOf(React.PropTypes.object),
  eventOpen: React.PropTypes.bool,
  remove: React.PropTypes.func,
  closeDialog: React.PropTypes.func,
  swapComponent: React.PropTypes.func,
  sections: React.PropTypes.instanceOf(List),
  components: React.PropTypes.instanceOf(List),
  currentCalendarName: React.PropTypes.string,
  setCalendarName: React.PropTypes.func,
  handleAuth: React.PropTypes.func,
  currentTermName: React.PropTypes.string,
  facebookPosted: React.PropTypes.func,
  regalSent: React.PropTypes.func,
  hasRegal: React.PropTypes.bool
};
