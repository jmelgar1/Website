import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '../styles/DrawingCanvas.css';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [model, setModel] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [trainingData, setTrainingData] = useState([]);
    const [label, setLabel] = useState('');

    // Initialize model
    useEffect(() => {
        const createModel = () => {
            const model = tf.sequential();

            // Add layers
            model.add(tf.layers.dense({
                inputShape: [784], // 28x28 pixels
                units: 128,
                activation: 'relu'
            }));

            model.add(tf.layers.dense({
                units: 10,
                activation: 'softmax'
            }));

            // Compile model
            model.compile({
                optimizer: 'adam',
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });

            setModel(model);
        };

        createModel();
    }, []);

    // Drawing functions
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineWidth = 2;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    // Clear canvas
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setPrediction(null);
    };

    // Process canvas data for prediction/training
    const processCanvasData = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = new Float32Array(784); // 28x28 = 784

        // Convert to grayscale and normalize
        for (let i = 0; i < imageData.data.length; i += 4) {
            const j = i / 4;
            data[j] = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / (3 * 255);
        }

        return data;
    };

    // Train model
    const trainModel = async () => {
        if (!model || !label) return;

        const data = processCanvasData();
        const labelArray = new Array(10).fill(0);
        labelArray[parseInt(label)] = 1;

        setTrainingData([...trainingData, { data, label: labelArray }]);

        // Train model with all data
        const xs = tf.tensor2d(trainingData.map(item => item.data));
        const ys = tf.tensor2d(trainingData.map(item => item.label));

        await model.fit(xs, ys, {
            epochs: 10,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
                }
            }
        });

        clearCanvas();
    };

    // Make prediction
    const predict = async () => {
        if (!model) return;

        const data = processCanvasData();
        const prediction = await model.predict(tf.tensor2d([data])).array();
        const predictedDigit = prediction[0].indexOf(Math.max(...prediction[0]));
        setPrediction(predictedDigit);
    };

    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                width={280}
                height={280}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
            <div className="controls">
                <button onClick={clearCanvas}>Clear</button>
                <div className="training-controls">
                    <input
                        type="number"
                        min="0"
                        max="9"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="Enter digit (0-9)"
                    />
                    <button onClick={trainModel}>Train</button>
                </div>
                <button onClick={predict}>Predict</button>
            </div>
            {prediction !== null && (
                <div className="prediction">
                    Predicted digit: {prediction}
                </div>
            )}
        </div>
    );
};

export default DrawingCanvas;