import React, {useState, useRef, useEffect} from 'react'
import {useOutletContext} from "react-router";
import {CheckCircle2, ImageIcon, UploadIcon} from "lucide-react";
import type {AuthContext, UploadProps} from "../type";
import {PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS} from "../lib/constants";

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const {isSignedIn} = useOutletContext<AuthContext>();

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (!isSignedIn) return;

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            handleFile(droppedFiles[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            handleFile(selectedFiles[0]);
        }
    };

    const handleFile = (selectedFile: File) => {
        if (!isSignedIn) return;
        setFile(selectedFile);
        processFile(selectedFile);
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Data = e.target?.result as string;
            
            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += PROGRESS_STEP;
                if (currentProgress >= 100) {
                    currentProgress = 100;
                    clearInterval(interval);
                    setProgress(100);
                    
                    setTimeout(() => {
                        onComplete(base64Data);
                    }, REDIRECT_DELAY_MS);
                } else {
                    setProgress(currentProgress);
                }
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="upload">
            {!file ? (
                <div 
                    className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => isSignedIn && fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        className="drop-input"
                        accept=".jpg, .jpeg, .png"
                        disabled={!isSignedIn}
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20}/>
                        </div>
                        <p>
                            {!isClient ? (
                                "Click or drag and drop your floor plan here"
                            ) : isSignedIn ? (
                                "Click or drag and drop your floor plan here"
                            ): ("Sign in or sign up with puter to upload your floor plan")
                            }
                        </p>
                        <p className="help">Maximum file size up to 10 MB.</p>
                    </div>
                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? (
                                <CheckCircle2 className="check"/>
                            ) : (
                                <ImageIcon className="image"/>
                            )}
                        </div>
                        <h3>{file.name}</h3>
                        <div className="progress">
                            <div className="bar" style={{width: `${progress}%`}}/>
                            <p className="status-text">
                                {progress < 100 ? "Analyzing floor plan ..." : "Redirecting..."}

                            </p>
                        </div>

                    </div>

                </div>
            )}

        </div>

    )
}
export default Upload
