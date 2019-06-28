import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useWebCamSensor from "./useWebcamSensor";
import { initialItems } from "./data";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  color: "white",
  borderRadius: "5px",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
  margin: "0 10px",
  borderRadius: "5px"
});

const reorder = (columns, source, destination, draggableId) => {
  const home = columns[source.droppableId];
  const finish = columns[destination.droppableId];
  if (home === finish) {
    const homeQuoteIds = Array.from(home.quoteIds);
    homeQuoteIds.splice(source.index, 1);
    homeQuoteIds.splice(destination.index, 0, draggableId);
    const newHome = {
      ...home,
      quoteIds: homeQuoteIds
    };
    return {
      ...columns,
      [home.id]: newHome
    };
  }

  const homeQuoteIds = Array.from(home.quoteIds);
  homeQuoteIds.splice(source.index, 1);
  const newHome = {
    ...home,
    quoteIds: homeQuoteIds
  };

  const finishQuoteIds = Array.from(finish.quoteIds);
  finishQuoteIds.splice(destination.index, 0, draggableId);
  const newFinish = {
    ...finish,
    quoteIds: finishQuoteIds
  };

  return {
    ...columns,
    [home.id]: newHome,
    [finish.id]: newFinish
  };
};

export default class DragAndDrop extends React.Component {
  state = {
    items: initialItems()
  };

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;
    const draggableId = result.draggableId;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const columns = this.state.items.columns;

    this.setState({
      items: {
        ...this.state.items,
        columns: reorder(columns, source, destination, draggableId)
      }
    });
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd} sensors={[useWebCamSensor]}>
        <div style={{ display: "flex" }}>
          {this.state.items.columnOrder.map((columnId, index) => {
            const column = this.state.items.columns[columnId];
            return (
              <Droppable droppableId={columnId} index={index} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {column.quoteIds.map((quoteId, index) => {
                      const quote = this.state.items.quotes[quoteId];
                      return (
                        <Draggable
                          key={quote.id}
                          draggableId={quote.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              {quote.content}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    );
  }
}
