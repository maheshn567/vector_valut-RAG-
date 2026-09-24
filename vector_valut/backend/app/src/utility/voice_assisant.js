export default async function process_voice(text = null, audio_file = null, transcribe = false, translation = false) {
  try {
    const endpoint = transcribe ? 'transcribe' : 'translate';
    const url = `http://localhost:8000/${endpoint}`;
    let response;

    if (audio_file) {
      // 1. Build FormData using a Blob from the multer file buffer
      const formData = new FormData();
      const blob = new Blob([audio_file.buffer], { type: audio_file.mimetype });
      formData.append('file', blob, audio_file.originalname);

      // 2. Omit the manual Content-Type header so the runtime automatically configures the boundary string
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-Key': process.env.RAG_SERVICE_API_KEY || ""
        },
        body: formData
      });
    } else if (text) {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.RAG_SERVICE_API_KEY || ""
        },
        body: JSON.stringify({ query: text })
      });
    } else {
      throw new Error("Either audio or text parameter must be supplied.");
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Voice microservice failed: ${response.statusText} (${errText})`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error inside process_voice utility:", error);
    return { success: false, error: { message: error.message } };
  }
}