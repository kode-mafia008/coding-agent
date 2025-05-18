/**
 * Audio recording and processing utilities for the live call feature
 */

/**
 * Start audio recording with the browser's MediaRecorder API
 * @returns Promise with the MediaRecorder instance and stream
 */
export async function startAudioRecording(): Promise<{
  mediaRecorder: MediaRecorder;
  stream: MediaStream;
}> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    return { mediaRecorder, stream };
  } catch (error) {
    console.error('Error accessing microphone:', error);
    throw new Error('Unable to access microphone. Please check your browser permissions.');
  }
}

/**
 * Stop all tracks on a media stream
 * @param stream The MediaStream to stop
 */
export function stopMediaStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

/**
 * Process audio data by sending it to the transcription API
 * @param audioBlob The recorded audio as a Blob
 * @returns Promise with the transcription result
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  
  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to transcribe audio');
  }
  
  const data = await response.json();
  return data.transcript;
}

/**
 * Get AI response from Gemini for the given text
 * @param text The transcribed text to process
 * @param context Optional conversation history
 * @returns Promise with the AI response
 */
export async function getGeminiResponse(
  text: string, 
  context: Array<{ role: string; content: string }> = []
): Promise<string> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, context })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get AI response');
  }
  
  const data = await response.json();
  return data.text;
}
