import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "./constants";

export default function App() {
  const stageRef = useRef();
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("#ffc9c9");
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [scribbles, setScribbles] = useState([]);
  const [strokeColor, setStrokeColor] = useState("#B92929");
  const [edge, setEdge] = useState(10)
  const [strokeWidth, setStrokeWidth] = useState(3)

  const isPainting = useRef();
  const currentShapeId = useRef();
  const transformerRef = useRef();

  let isDraggable = action === ACTIONS.SELECT;

  function onPointerDown() {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();

    currentShapeId.current = id;
    isPainting.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) => [
          ...rectangles,
          {
            id,
            x,
            y,
            height: 1,
            width: 1,
            fillColor,
            strokeColor,
            edge,
            strokeWidth,
          },
        ]);
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) => [
          ...circles,
          {
            id,
            x,
            y,
            radius: 1,
            fillColor,
            strokeColor,
            strokeWidth,
          },
        ]);
        break;

      case ACTIONS.ARROW:
        setArrows((arrows) => [
          ...arrows,
          {
            id,
            points: [x, y, x + 1, y + 1],
            fillColor,
            strokeColor,
            strokeWidth,
          },
        ]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) => [
          ...scribbles,
          {
            id,
            points: [x, y, x + 1, y + 1],
            fillColor,
            strokeColor,
            strokeWidth,
          },
        ]);
        break;
    }
  }
  function onPointerMove() {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                x: Math.min(rectangle.x, x),
                y: Math.min(rectangle.y, y),
                width: Math.abs(x - rectangle.x),
                height: Math.abs(y - rectangle.y),
              };
            }
            return rectangle;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
        break;
    }
  }

  function onPointerUp() {
    isPainting.current = false;
  }

  function handleExport() {
    const uri = stageRef.current.toDataURL();
    var link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function onClick(e) {
    if(action === ACTIONS.SELECT) {
      const target = e.currentTarget;
      console.log(target)
      transformerRef.current.nodes([target]);
    } else {
      return
    }
  }

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Controls */}
        <div className="absolute top-0 z-10 w-full py-2 ">
          <div className="flex justify-center items-center gap-1 p-1 w-fit mx-auto border shadow-lg rounded-lg">
            <button
              className={
                action === ACTIONS.SELECT
                  ? "bg-violet-200 p-2 rounded-lg"
                  : "p-2 hover:bg-violet-100 rounded-lg"
              }
              onClick={() => setAction(ACTIONS.SELECT)}
            >
              <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 22 22" className="w-5 h-5" fill="none" strokeWidth="1.25"><g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6 6l4.153 11.793a0.365 .365 0 0 0 .331 .207a0.366 .366 0 0 0 .332 -.207l2.184 -4.793l4.787 -1.994a0.355 .355 0 0 0 .213 -.323a0.355 .355 0 0 0 -.213 -.323l-11.787 -4.36z"></path><path d="M13.5 13.5l4.5 4.5"></path></g></svg>
            </button>
            <button
              className={
                action === ACTIONS.RECTANGLE
                  ? "bg-violet-200 p-2 rounded-lg"
                  : "p-2 hover:bg-violet-100 rounded-lg"
              }
              onClick={() => {
                transformerRef.current.nodes([])
                setAction(ACTIONS.RECTANGLE)
              }}
            >
              <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect></g></svg>
            </button>
            <button
              className={
                action === ACTIONS.CIRCLE
                  ? "bg-violet-200 p-2 rounded-lg"
                  : "p-2 hover:bg-violet-100 rounded-lg"
              }
              onClick={() => {
                transformerRef.current.nodes([])
                setAction(ACTIONS.CIRCLE)
              }}
            >
              <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="12" r="9"></circle></g></svg>
            </button>
            <button
              className={
                action === ACTIONS.ARROW
                  ? "bg-violet-200 p-2 rounded-lg text-black"
                  : "p-2 hover:bg-violet-100 rounded-lg text-black"
              }
              onClick={() => {
                transformerRef.current.nodes([])
                setAction(ACTIONS.ARROW)
              }}
            >
              <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><g strokeWidth="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="5" y1="12" x2="19" y2="12"></line><line x1="15" y1="16" x2="19" y2="12"></line><line x1="15" y1="8" x2="19" y2="12"></line></g></svg>
            </button>
            <button
              className={
                action === ACTIONS.SCRIBBLE
                  ? "bg-violet-200 p-2 rounded-lg"
                  : "p-2 hover:bg-violet-100 rounded-lg"
              }
              onClick={() => {
                transformerRef.current.nodes([])
                setAction(ACTIONS.SCRIBBLE)
              }}
            >
              <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.25"><path clipRule="evenodd" d="m7.643 15.69 7.774-7.773a2.357 2.357 0 1 0-3.334-3.334L4.31 12.357a3.333 3.333 0 0 0-.977 2.357v1.953h1.953c.884 0 1.732-.352 2.357-.977Z"></path><path d="m11.25 5.417 3.333 3.333"></path></g></svg>
            </button>

            <button onClick={ () => {
                transformerRef.current.nodes([])
                handleExport()
              }} className="hover:bg-violet-100 rounded-lg p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </button>
          </div>
        </div>
        {/*side panel*/}
        <div className="absolute z-10 left-0 ml-2 top-1/4 bg-white border rounded-lg shadow-lg p-4">
              <div className="mb-2">
                <p className="text-xs text-slate-500 mb-1">Stroke</p>
                <div className="flex gap-1">
                  <button onClick={ () => setStrokeColor("#1E1E1E")} className ="w-5 h-5 bg-black border border-slate-300 rounded"></button>
                  <button onClick={ () => setStrokeColor("#B92929")} className="w-5 h-5 bg-stroke-red border border-slate-300 rounded"></button>
                  <button onClick={ () => setStrokeColor("#278338")} className="w-5 h-5 bg-stroke-green border border-slate-300 rounded"></button>
                  <button onClick={ () => setStrokeColor("#155ea1")} className="w-5 h-5 bg-stroke-blue border border-slate-300 rounded"></button>
                  <button onClick={ () => setStrokeColor("#c77400")} className="w-5 h-5 bg-stroke-orange border border-slate-300 rounded"></button>
                  <input
                    className="w-5 h-5 rounded border-none ml-2"
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2">
                <p className="text-xs text-slate-500 mb-1">Background</p>
                <div className="flex gap-1">
                  <button onClick={ () => setFillColor("#00000000")} className ="w-5 h-5 bg-fill-transparent border border-slate-300 rounded"></button>
                  <button onClick={ () => setFillColor("#ffc9c9")} className="w-5 h-5 bg-fill-red border border-slate-300 rounded"></button>
                  <button onClick={ () => setFillColor("#b2f2bb")} className="w-5 h-5 bg-fill-green border border-slate-300 rounded"></button>
                  <button onClick={ () => setFillColor("#a5d8ff")} className="w-5 h-5 bg-fill-blue border border-slate-300 rounded"></button>
                  <button onClick={ () => setFillColor("#ffec99")} className="w-5 h-5 bg-fill-orange border border-slate-300 rounded"></button>
                  <input
                    className="w-5 h-5 rounded border-none ml-2"
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2">
                <p className="text-xs text-slate-500 mb-1">Edge</p>
                <div className="flex gap-1">
                  <button onClick={ () => setEdge(0)} className ={`w-8 h-8 border border-slate-300 rounded flex justify-center items-center text-purple-700 ${edge === 0 && "bg-purple-100"}`}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M3.33334 9.99998V6.66665C3.33334 6.04326 3.33403 4.9332 3.33539 3.33646C4.95233 3.33436 6.06276 3.33331 6.66668 3.33331H10"></path>
                      <path d="M13.3333 3.33331V3.34331"></path>
                      <path d="M16.6667 3.33331V3.34331"></path>
                      <path d="M16.6667 6.66669V6.67669"></path>
                      <path d="M16.6667 10V10.01"></path>
                      <path d="M3.33334 13.3333V13.3433"></path>
                      <path d="M16.6667 13.3333V13.3433"></path>
                      <path d="M3.33334 16.6667V16.6767"></path>
                      <path d="M6.66666 16.6667V16.6767"></path>
                      <path d="M10 16.6667V16.6767"></path>
                      <path d="M13.3333 16.6667V16.6767"></path>
                      <path d="M16.6667 16.6667V16.6767"></path>
                    </svg>
                  </button>
                  <button onClick={ () => setEdge(10)} className ={`w-8 h-8 border border-slate-300 rounded flex justify-center items-center text-purple-700 ${edge === 10 && "bg-purple-100"}`}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <g strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v-4a4 4 0 0 1 4 -4h4"></path>
                        <line x1="16" y1="4" x2="16" y2="4.01"></line>
                        <line x1="20" y1="4" x2="20" y2="4.01"></line>
                        <line x1="20" y1="8" x2="20" y2="8.01"></line>
                        <line x1="20" y1="12" x2="20" y2="12.01"></line>
                        <line x1="4" y1="16" x2="4" y2="16.01"></line>
                        <line x1="20" y1="16" x2="20" y2="16.01"></line>
                        <line x1="4" y1="20" x2="4" y2="20.01"></line>
                        <line x1="8" y1="20" x2="8" y2="20.01"></line>
                        <line x1="12" y1="20" x2="12" y2="20.01"></line>
                        <line x1="16" y1="20" x2="16" y2="20.01"></line>
                        <line x1="20" y1="20" x2="20" y2="20.01"></line>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="">
                <p className="text-xs text-slate-500 mb-1">Stroke Width</p>
                <div className="flex gap-1">
                  <button onClick={ () => setStrokeWidth(1)} className ={`w-8 h-8 border border-slate-300 rounded flex justify-center items-center text-purple-700 ${strokeWidth === 1 && "bg-purple-100"}`}>
                  <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.167 10h11.666" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  </button>
                  <button onClick={ () => setStrokeWidth(3)} className={`w-8 h-8 border border-slate-300 rounded flex justify-center items-center text-purple-700 ${strokeWidth === 3 && "bg-purple-100"}`}>
                  <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 10h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  </button>
                  <button onClick={ () => setStrokeWidth(5)} className={`w-8 h-8 border border-slate-300 rounded flex justify-center items-center text-purple-700 ${strokeWidth === 5 && "bg-purple-100"}`}>
                  <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 10h10" stroke="currentColor" strokeWidth="3.75" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  </button>
                </div>
              </div>
        </div>

        {/* Canvas */}
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="cursor-crosshair"
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              height={window.innerHeight}
              width={window.innerWidth}
              fill="#ffffff"
              id="bg"
              onClick={() => {
                transformerRef.current.nodes([]);
              }}
            />

            {rectangles.map((rectangle) => (
              isPainting && rectangle.width > 0 && rectangle.height > 0 &&
              <Rect
                key={rectangle.id}
                x={rectangle.x}
                y={rectangle.y}
                stroke={rectangle.strokeColor}
                strokeWidth={rectangle.strokeWidth}
                fill={rectangle.fillColor}
                height={rectangle.height}
                width={rectangle.width}
                draggable={isDraggable}
                onClick={onClick}
                // cornerRadius={Math.max(0, Math.min(rectangle.width, rectangle.height) / rectangle.edge)}
                cornerRadius={rectangle.edge}
              />
            ))}

            {circles.map((circle) => (
              <Circle
                key={circle.id}
                radius={circle.radius}
                x={circle.x}
                y={circle.y}
                stroke={circle.strokeColor}
                strokeWidth={circle.strokeWidth}
                fill={circle.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}
            {arrows.map((arrow) => (
              <Arrow
                key={arrow.id}
                points={arrow.points}
                stroke={arrow.strokeColor}
                strokeWidth={arrow.strokeWidth}
                fill={arrow.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}

            {scribbles.map((scribble) => (
              <Line
                key={scribble.id}
                lineCap="round"
                lineJoin="round"
                points={scribble.points}
                stroke={scribble.strokeColor}
                strokeWidth={scribble.strokeWidth}
                fill={scribble.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}

            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </div>
    </>
  );
}
