"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 🔹 Map language to Supabase table
const tableMap: { [key: string]: string } = {
  Malay: "malay_scripts",
  English: "english_scripts",
  Mandarin: "mandarin_scripts",
  Cantonese: "cantonese_scripts"
}

type Language = "Malay" | "English" | "Mandarin" | "Cantonese"

const speakerMap: Record<Language, string[]> = {

  Mandarin: [
"#000101","#000102","#000103","#000104","#000105","#000106","#000107","#000108","#000109","#000110",
"#000111","#000112","#000113","#000114","#000115","#000116","#000117","#000118","#000119","#000120",
"#000121","#000122","#000123","#000124","#000125","#000126","#000127","#000128","#000129","#000130",
"#000131","#000132","#000133","#000134","#000135","#000136","#000137","#000138","#000139","#000140",
"#000141","#000142","#000143","#000144","#000145","#000146","#000147","#000148","#000149","#000150"
  ],

  Cantonese: [
"#000201","#000202","#000203","#000204","#000205","#000206","#000207","#000208","#000209","#000210",
"#000211","#000212","#000213","#000214","#000215","#000216","#000217","#000218","#000219","#000220",
"#000221","#000222","#000223","#000224","#000225","#000226","#000227","#000228","#000229","#000230",
"#000231","#000232","#000233","#000234","#000235","#000236","#000237","#000238","#000239","#000240",
"#000241","#000242","#000243","#000244","#000245","#000246","#000247","#000248","#000249","#000250"
  ],

  English: [
"#000301","#000302","#000303","#000304","#000305","#000306","#000307","#000308","#000309","#000310",
"#000311","#000312","#000313","#000314","#000315","#000316","#000317","#000318","#000319","#000320",
"#000321","#000322","#000323","#000324","#000325","#000326","#000327","#000328","#000329","#000330",
"#000331","#000332","#000333","#000334","#000335","#000336","#000337","#000338","#000339","#000340",
"#000341","#000342","#000343","#000344","#000345","#000346","#000347","#000348","#000349","#000350",
"#000351","#000352","#000353","#000354","#000355","#000356","#000357","#000358","#000359","#000360",
"#000361","#000362","#000363","#000364","#000365","#000366","#000367","#000368","#000369","#000370",
"#000371","#000372","#000373","#000374","#000375","#000376","#000377","#000378","#000379","#000380",
"#000381","#000382","#000383","#000384","#000385","#000386","#000387","#000388","#000389","#000390",
"#000391","#000392","#000393","#000394","#000395","#000396","#000397","#000398","#000399",
"#003100"
  ],

  Malay: [
"#000401","#000402","#000403","#000404","#000405","#000406","#000407","#000408","#000409","#000410",
"#000411","#000412","#000413","#000414","#000415","#000416","#000417","#000418","#000419","#000420",
"#000421","#000422","#000423","#000424","#000425","#000426","#000427","#000428","#000429","#000430",
"#000431","#000432","#000433","#000434","#000435","#000436","#000437","#000438","#000439","#000440",
"#000441","#000442","#000443","#000444","#000445","#000446","#000447","#000448","#000449","#000450",
"#000451","#000452","#000453","#000454","#000455","#000456","#000457","#000458","#000459","#000460",
"#000461","#000462","#000463","#000464","#000465","#000466","#000467","#000468","#000469","#000470",
"#000471","#000472","#000473","#000474","#000475","#000476","#000477","#000478","#000479","#000480",
"#000481","#000482","#000483","#000484","#000485","#000486","#000487","#000488","#000489","#000490",
"#000491","#000492","#000493","#000494","#000495","#000496","#000497","#000498","#000499",
"#004100","#004101","#004102","#004103","#004104","#004105","#004106","#004107","#004108","#004109",
"#004110","#004111","#004112","#004113","#004114","#004115","#004116","#004117","#004118","#004119",
"#004120","#004121","#004122","#004123","#004124","#004125","#004126","#004127","#004128","#004129",
"#004130","#004131","#004132","#004133","#004134","#004135","#004136","#004137","#004138","#004139",
"#004140","#004141","#004142","#004143","#004144","#004145","#004146","#004147","#004148","#004149",
"#004150"
  ]

}

export default function Home() {
  const [language, setLanguage] = useState<Language | "">("")
  const [speaker, setSpeaker] = useState("")
  const [availableSpeakers, setAvailableSpeakers] = useState<string[]>([])
  const [scripts, setScripts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})
  const [typedID, setTypedID] = useState("")

  // 🔹 Get available speakers
  useEffect(() => {

    if (!language) {
      setAvailableSpeakers([])
      return
    }
  
    type Language = "Malay" | "English" | "Mandarin" | "Cantonese"
    const ids = language ? speakerMap[language as Language] : []
  
    setAvailableSpeakers(ids)
  
    setSpeaker("")
    setScripts([])
  
  }, [language])

  // 🔹 Fetch scripts for selected speaker
  const fetchScripts = async () => {
    if (!language || !speaker) {
      alert("Please select a language and ID.")
      return
    }

    setLoading(true)

    const table = tableMap[language]

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("speaker", speaker)
      .order("script_name", { ascending: true })
      .order("line_id", { ascending: true })

    if (error) {
      console.error("Error fetching scripts:", error)
      alert("Error fetching scripts")
    } else {
      setScripts(data || [])
    }

    setLoading(false)
  }

  // 🔹 Group scripts
  const groupedScripts = scripts.reduce((acc: any, script: any) => {
    const key = `${script.script_name} - ${script.role}`

    if (!acc[key]) acc[key] = []
    acc[key].push(script.lines)

    return acc
  }, {})

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="min-h-screen bg-[#F5EBDC] flex flex-col items-center p-8 text-black">

      <img src="/lifewood-logo.png" alt="Lifewood" className="w-64 mb-6" />

      <div className="bg-white shadow-xl rounded-2xl p-12 w-full max-w-6xl border border-gray-200">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome to Lifewood's Multilingual Speech Recording Project!
        </h1>

        {/* Instructions */}
        <div className="bg-[#F9FAF7] border border-gray-200 p-6 rounded-xl mb-8 text-sm leading-relaxed text-center text-black"> 
          <p className="mb-4"> 
            After calling the provided number, make sure you enter your ID correctly and then you can start speaking. 
            Talk naturally. Take your time to get used to the scripts. You are free to improvise and adjust the scripts. 
            You may change some words and sentences, or add filler sounds (e.g.: "umm", "hmm", "lah", etc.) as long as they sound natural. 
            You may change the names in your lines to your own name. 
            Don’t pause for too long between your lines in the scripts. 0.5–1 second is enough. 
            If you make a mistake (e.g.: mispronounce a word, etc.), just continue with the script. Do not end the call.
          </p> 
          <p className="mb-4"> 
            Please record a total of 45–50 minutes for each language. 
            Once you've reached this range, you may stop recording and disregard any remaining scripts.
            If the provided scripts are insufficient to reach the target duration, please inform us.
          </p> 
          <p> 
            <strong> PLEASE UNDERSTAND THE GUIDE BEFORE RECORDING. ASK US IF YOU HAVE ANY QUESTIONS. </strong> 
          </p> 
          <p> 
            <strong> FILL IN THE SPREADSHEET AFTER YOU FINISH RECORDING EACH SCRIPT. </strong> 
          </p> 
          <p className="mb-4"> 
            Select the language you want to record and select or enter your ID to see your scripts.
          </p> 
        </div>

        <div className="max-w-4xl mx-auto">

        {/* Row 1: Inputs */}
        <div className="grid grid-cols-3 gap-4 mb-4">

          {/* Language */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="border border-gray-300 bg-white text-black p-3 rounded-lg"
          >
            <option value="">Select Language</option>
            <option value="Malay">Malay</option>
            <option value="English">English</option>
            <option value="Mandarin">Mandarin</option>
            <option value="Cantonese">Cantonese</option>
          </select>

          {/* Select ID */}
          <select
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            className="border border-gray-300 bg-white text-black p-3 rounded-lg"
          >
            <option value="">Select Your ID</option>
            {availableSpeakers.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

          {/* Type ID */}
          <input
            type="text"
            placeholder="Or type your ID (e.g. 000123)"
            value={typedID}
            onChange={(e) => {
              const value = e.target.value.replace("#","")
              setTypedID(value)
              setSpeaker(`#${value}`)
            }}
            className="border border-gray-300 bg-white text-black p-3 rounded-lg"
          />

        </div>

        {/* Row 2: Button */}
        <div className="w-full mb-8">
          <button
            onClick={fetchScripts}
            className="w-full bg-[#0F5B3C] text-white px-12 py-3 rounded-lg font-semibold hover:bg-[#0c4a31] transition"
          >
            {loading ? "Loading..." : "View Scripts"}
          </button>
        </div>

        </div>

        {Object.keys(groupedScripts).length === 0 && !loading && (
          <p className="text-center">No scripts found.</p>
        )}

        {Object.entries(groupedScripts).map(([key, lines]: any, index) => (
          <div key={index} className="mb-8">

            <div
              onClick={() => toggleSection(key)}
              className="cursor-pointer bg-[#0F5B3C] text-white px-6 py-3 rounded-lg font-semibold flex justify-between"
            >
              <span>{key}</span>
              <span>{openSections[key] ? "−" : "+"}</span>
            </div>

            {openSections[key] && (
              <div className="mt-4 bg-[#F9FAF7] p-6 rounded-lg">
                {lines.map((line: string, i: number) => (
                  <div
                    key={i}
                    className="border-t border-b border-gray-300 py-3 text-left"
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  )
}