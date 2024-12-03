function GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY) {
    var trans1 = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translationX, translationY, translationZ, 1
    ];
    var rotatXCos = Math.cos(rotationX);
    var rotatXSin = Math.sin(rotationX);
    var rotatYCos = Math.cos(rotationY);
    var rotatYSin = Math.sin(rotationY);

    var rotatx = [
        1, 0, 0, 0,
        0, rotatXCos, -rotatXSin, 0,
        0, rotatXSin, rotatXCos, 0,
        0, 0, 0, 1
    ];

    var rotaty = [
        rotatYCos, 0, -rotatYSin, 0,
        0, 1, 0, 0,
        rotatYSin, 0, rotatYCos, 0,
        0, 0, 0, 1
    ];

    var test1 = MatrixMult(rotaty, rotatx);
    var test2 = MatrixMult(trans1, test1);
    var mvp = MatrixMult(projectionMatrix, test2);

    return mvp;
}

class MeshDrawer {
    constructor() {
        this.prog = InitShaderProgram(meshVS, meshFS);

        this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
        this.showTexLoc = gl.getUniformLocation(this.prog, 'showTex');

        // Lighting uniforms
        this.enableLightingLoc = gl.getUniformLocation(this.prog, 'enableLighting');
        this.ambientLoc = gl.getUniformLocation(this.prog, 'ambient');
        this.lightPosLoc = gl.getUniformLocation(this.prog, 'lightPos');

        this.vertPosLoc = gl.getAttribLocation(this.prog, 'pos');
        this.texCoordLoc = gl.getAttribLocation(this.prog, 'texCoord');

        this.vertbuffer = gl.createBuffer();
        this.texbuffer = gl.createBuffer();

        this.numTriangles = 0;

        // Default lighting values
        this.lightPos = [1.0, 1.0, 1.0];
        this.ambientIntensity = 0.5;
    }

    setMesh(vertPos, texCoords, normalCoords) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        this.numTriangles = vertPos.length / 3;

        if (normalCoords) {
            this.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalCoords), gl.STATIC_DRAW);
            this.normalLoc = gl.getAttribLocation(this.prog, 'normal');
        }
    }

    draw(trans) {
        gl.useProgram(this.prog);

        gl.uniformMatrix4fv(this.mvpLoc, false, trans);
        gl.uniform3fv(this.lightPosLoc, this.lightPos);
        gl.uniform1f(this.ambientLoc, this.ambientIntensity);
        gl.uniform1i(this.enableLightingLoc, true);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
        gl.enableVertexAttribArray(this.vertPosLoc);
        gl.vertexAttribPointer(this.vertPosLoc, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
        gl.enableVertexAttribArray(this.texCoordLoc);
        gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

        if (this.normalBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.enableVertexAttribArray(this.normalLoc);
            gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
        }

        updateLightPos();
        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
    }

    setTexture(img) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

        if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }

        gl.useProgram(this.prog);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const sampler = gl.getUniformLocation(this.prog, 'tex');
        gl.uniform1i(sampler, 0);
    }

    enableLighting(enable) {
        gl.useProgram(this.prog);
        gl.uniform1i(this.enableLightingLoc, enable);
    }

    setAmbientLight(ambient) {
        this.ambientIntensity = ambient;
        gl.useProgram(this.prog);
        gl.uniform1f(this.ambientLoc, ambient);
    }
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

function updateLightPos() {
    const translationSpeed = 1;
    if (keys['ArrowUp']) lightY -= translationSpeed;
    if (keys['ArrowDown']) lightY += translationSpeed;
    if (keys['ArrowRight']) lightX -= translationSpeed;
    if (keys['ArrowLeft']) lightX += translationSpeed;
}

// Vertex Shader
const meshVS = `
    attribute vec3 pos; 
    attribute vec2 texCoord; 
    attribute vec3 normal;

    uniform mat4 mvp; 

    varying vec2 v_texCoord; 
    varying vec3 v_normal; 

    void main() {
        v_texCoord = texCoord;
        v_normal = normal;

        gl_Position = mvp * vec4(pos,1);
    }`;

// Fragment Shader
const meshFS = `
    precision mediump float;

    uniform bool showTex;
    uniform bool enableLighting;
    uniform sampler2D tex;
    uniform vec3 lightPos;
    uniform float ambient;

    varying vec2 v_texCoord;
    varying vec3 v_normal;

    void main() {
        vec3 norm = normalize(v_normal);
        vec3 lightDir = normalize(lightPos);

        vec4 ambientLight = vec4(ambient, ambient, ambient, 1.0);
        float diff = max(dot(norm, lightDir), 0.0);
        vec4 diffuseLight = vec4(diff, diff, diff, 1.0);

        if (enableLighting) {
            vec4 texColor = texture2D(tex, v_texCoord);
            gl_FragColor = texColor * (ambientLight + diffuseLight);
        } else if (showTex) {
            gl_FragColor = texture2D(tex, v_texCoord);
        } else {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    }`;

// Arrow Key Light Movement
const keys = {};
function updateLightPos() {
    const translationSpeed = 1;
    if (keys['ArrowUp']) lightY -= translationSpeed;
    if (keys['ArrowDown']) lightY += translationSpeed;
    if (keys['ArrowRight']) lightX -= translationSpeed;
    if (keys['ArrowLeft']) lightX += translationSpeed;
}
