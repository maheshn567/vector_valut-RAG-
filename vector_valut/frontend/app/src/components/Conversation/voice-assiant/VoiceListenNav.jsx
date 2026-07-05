

export default function VoiceListenNav({appName="",retrivedChunks=""}){
    return(
        <div className="flex flex-row justify-center text-white">
            <h3 className="mx-2 text-lg font-bold">Vector Valut</h3>
            <h3 className="mx-2 text-lg font-bold">{appName}</h3>
            <h3 className="mx-2 text-lg font-bold">{retrivedChunks}</h3>
            <span>settings</span>
            <span>close</span>
        </div>
    )
}