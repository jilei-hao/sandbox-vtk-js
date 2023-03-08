import '@kitware/vtk.js/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkCamera from '@kitware/vtk.js/Rendering/Core/Camera';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkWindowedSincPolyDataFilter from '@kitware/vtk.js/Filters/General/WindowedSincPolyDataFilter';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import vtkPolyDataReader from '@kitware/vtk.js/IO/Legacy/PolyDataReader';

// Force DataAccessHelper to have access to various data source
import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
const { fetchBinary } = vtkHttpDataAccessHelper;

const controlPanel = `<table>
<tr>
  <td>Iterations</td>
  <td>
    <input class='numberOfIterations' type="range" min="0" max="100" step="1" value="20" />
  </td>
  <td>
    <div id='numberOfIterationsValue'>20</div>
  </td>
</tr>
<tr>
  <td>Pass band</td>
  <td>
    <input class='passBand' type="range" min="0" max="2" step="0.001" value="0.25" />
  </td>
  <td>
    <div id='passBandValue'>0.25</div>
  </td>
</tr>
<tr>
  <td>Feature Angle</td>
  <td>
    <input class='featureAngle' type="range" min="1" max="180" step="1" value="45" />
  </td>
  <td>
    <div id='featureAngleValue'></div>
  </td>
</tr>
<tr>
  <td>Edge Angle</td>
  <td>
    <input class='edgeAngle' type="range" min="1" max="180" step="1" value="15" />
  </td>
  <td>
    <div id='edgeAngleValue'></div>
  </td>
</tr>
<tr>
  <td>Feature Edge Smoothing</td>
  <td>
    <input class='featureEdgeSmoothing' type='checkbox' />
  </td>
</tr>
<tr>
  <td>Boundary Smoothing</td>
  <td>
    <input class='boundarySmoothing' type='checkbox' checked />
  </td>
</tr>
<tr>
  <td>Non Manifold Smoothing</td>
  <td>
    <input class='nonManifoldSmoothing' type="checkbox" />
  </td>
</tr>
</table>
`;

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------

const actor = vtkActor.newInstance();
renderer.addActor(actor);

const mapper = vtkMapper.newInstance({ interpolateScalarBeforeMapping: true });
actor.setMapper(mapper);

const cam = vtkCamera.newInstance();
renderer.setActiveCamera(cam);
cam.setFocalPoint(0, 0, 0);
cam.setPosition(0, 0, 10);
cam.setClippingRange(0.1, 50.0);

// Build pipeline
const reader = vtkXMLPolyDataReader.newInstance();

fetchBinary(`http://10.102.135.97:8081/cow.vtp`).then((bModel) => {
    console.log("fetchBinary: ", bModel);
    
    reader.parseAsArrayBuffer(bModel);
    renderer.resetCamera();
    renderWindow.render();
});


const smoothFilter = vtkWindowedSincPolyDataFilter.newInstance({
  nonManifoldSmoothing: 0,
  numberOfIterations: 10,
});
smoothFilter.setInputConnection(reader.getOutputPort());
mapper.setInputConnection(smoothFilter.getOutputPort());

// ----------------------------------------------------------------------------
// UI control handling
// ----------------------------------------------------------------------------

fullScreenRenderer.addController(controlPanel);

// Warp setup
[
  'numberOfIterations',
  'passBand',
  'featureAngle',
  'edgeAngle',
  'nonManifoldSmoothing',
  'featureEdgeSmoothing',
  'boundarySmoothing',
].forEach((propertyName) => {
  document.querySelector(`.${propertyName}`).addEventListener('change', (e) => {
    const valueDiv = document.getElementById(`${propertyName}Value`);

    let value;
    if (Number.isNaN(e.target.valueAsNumber)) {
      value = e.target.checked ? 1 : 0;
    } else {
      value = e.target.valueAsNumber;
    }
    if (propertyName === 'passBand') {
      // This formula maps:
      // 0.0  -> 1.0   (almost no smoothing)
      // 0.25 -> 0.1   (average smoothing)
      // 0.5  -> 0.01  (more smoothing)
      // 1.0  -> 0.001 (very strong smoothing)
      value = 10.0 ** (-4.0 * value);
    }
    smoothFilter.set({ [propertyName]: value });
    renderWindow.render();
    if (valueDiv)
      valueDiv.textContent = value;
    console.log({ [propertyName]: value });
  });
});

// -----------------------------------------------------------

renderer.resetCamera();
renderWindow.render();

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.source = reader;
global.filter = smoothFilter;
global.mapper = mapper;
global.actor = actor;
