

export default function VoiceSpeakNav({isSpeaking=false,llmResponse="",chunks=""}){
    return(
        <div>
        <nav className="w-full">
            <div>
            <h3>Vector Valut</h3>
            <span>settings</span>
            <span>close</span>
            </div>
        </nav>
        {/*VoiceAssistantInterface*/}
        <main>
            <div>
                {isSpeaking&&<p>{llmResponse}</p>}
                {isSpeaking&&<p>{chunks}</p>}
            </div>
        </main>
        </div>
    )
}