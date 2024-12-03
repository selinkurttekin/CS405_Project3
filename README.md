# CS405 - Project 2 (3D Object Renderer)

## Project Overview

This project is a **WebGL-based 3D Object Renderer** designed to load, render, and manipulate 3D `.obj` models. The renderer supports functionalities like texture mapping, lighting control, and rotation. Users can interact with the 3D scene through an intuitive UI that allows file uploads and real-time updates.

## Features

1. **3D Model Rendering**:

   - Supports `.obj` file loading to visualize 3D models.
   - Automatically adjusts the model's scale and orientation based on its bounding box.

2. **Texture Mapping**:

   - Allows users to upload a texture image (`.png`, `.jpg`, etc.) to wrap around the 3D model.
   - Supports multiple texture filters like mipmapping and edge clamping.

3. **Lighting Effects**:

   - Ambient and specular lighting effects for realism.
   - Users can adjust **ambient light density** and **specular light intensity** via sliders.

4. **UI Controls**:

   - Enable/Disable model rotation.
   - Toggle lighting effects.
   - Control rotation speed, ambient light, and specular light through sliders.

5. **Interactive Scene**:

   - Pan and zoom using mouse input.
   - Use keyboard arrow keys to move the light source.

6. **Bounding Box Display**:
   - Option to show or hide the bounding box of the 3D object.

## File Structure

1. **`project2.html`**:

   - HTML file containing the structure of the web application.
   - Includes controls for loading models, textures, and adjusting scene properties.

2. **`project2.js`**:

   - Core JavaScript file implementing the rendering logic.
   - Handles WebGL initialization, matrix calculations, shaders, and scene drawing.

3. **`obj.js`**:
   - Helper script to parse `.obj` files and extract vertex, normal, and texture coordinate data.
   - Provides functionality to scale and shift models for consistent rendering.

## Usage Instructions

### Setup and Run

1. Clone or download the repository.
2. Open `project2.html` in a modern browser (e.g., Chrome, Firefox) that supports WebGL.

### Upload 3D Models

1. Click "OBJ Model" to load a `.obj` file. Ensure the file contains valid vertex and face data.

### Add Texture

1. Upload a texture image using "Texture Image." This image will be applied to the 3D model.

### Adjust Scene

1. Use the sliders to adjust:
   - **Ambient Light Density**: Controls overall scene brightness.
   - **Specular Light Intensity**: Adds a shiny effect to the model.
   - **Rotation Speed**: Adjusts the model's auto-rotation speed.

### Keyboard and Mouse Controls

1. **Arrow Keys**: Move the light source.
2. **Mouse Wheel**: Zoom in/out of the scene.

## Code Highlights

### Matrix Calculations

- `GetModelViewProjection` function combines translation, rotation, and perspective matrices for rendering.

### Shaders

- **Vertex Shader**: Computes vertex positions and passes texture coordinates and normals.
- **Fragment Shader**: Implements lighting and texture mapping.

### MeshDrawer Class

- Manages the 3D object and its associated buffers (vertices, normals, textures).
- Provides functions to set mesh data, draw the model, and apply textures.

## Dependencies

- **WebGL**: Used for 3D rendering in browsers.
- **FileReader API**: To read `.obj` and texture files from user input.

## Known Issues

1. Ensure `.obj` files have valid faces and vertices; otherwise, the model might not load correctly.
2. Textures must have dimensions as powers of 2 (e.g., 256x256, 512x512) for optimal mipmapping.

## Future Improvements

1. Add support for additional file formats like `.glTF`.
2. Implement real-time shadows for enhanced realism.
3. Improve UI/UX with more responsive controls and feedback.

## Author

This project was developed for **CS405 - Computer Graphics** coursework.
