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
    "P000001",
    "P000101","P000102","P000103","P000104","P000105","P000106","P000107","P000108","P000109","P000110",
    "P000111","P000112","P000113","P000114","P000115","P000116","P000117","P000118","P000119","P000120",
    "P000121","P000122","P000123","P000124","P000125","P000126","P000127","P000128","P000129","P000130",
    "P000131","P000132","P000133","P000134","P000135","P000136","P000137","P000138","P000139","P000140",
    "P000141","P000142","P000143","P000144","P000145","P000146","P000147","P000148","P000149","P000150"
    ],

  Cantonese: [
    "P000001",
    "P000201","P000202","P000203","P000204","P000205","P000206","P000207","P000208","P000209","P000210",
    "P000211","P000212","P000213","P000214","P000215","P000216","P000217","P000218","P000219","P000220",
    "P000221","P000222","P000223","P000224","P000225","P000226","P000227","P000228","P000229","P000230",
    "P000231","P000232","P000233","P000234","P000235","P000236","P000237","P000238","P000239","P000240",
    "P000241","P000242","P000243","P000244","P000245","P000246","P000247","P000248","P000249","P000250"
    ],

  English: [
    "P000001",
    "P000301","P000302","P000303","P000304","P000305","P000306","P000307","P000308","P000309","P000310",
    "P000311","P000312","P000313","P000314","P000315","P000316","P000317","P000318","P000319","P000320",
    "P000321","P000322","P000323","P000324","P000325","P000326","P000327","P000328","P000329","P000330",
    "P000331","P000332","P000333","P000334","P000335","P000336","P000337","P000338","P000339","P000340",
    "P000341","P000342","P000343","P000344","P000345","P000346","P000347","P000348","P000349","P000350",
    "P000351","P000352","P000353","P000354","P000355","P000356","P000357","P000358","P000359","P000360",
    "P000361","P000362","P000363","P000364","P000365","P000366","P000367","P000368","P000369","P000370",
    "P000371","P000372","P000373","P000374","P000375","P000376","P000377","P000378","P000379","P000380",
    "P000381","P000382","P000383","P000384","P000385","P000386","P000387","P000388","P000389","P000390",
    "P000391","P000392","P000393","P000394","P000395","P000396","P000397","P000398","P000399",
    "P003100"
    ],

  Malay: [
    "P000001",
    "P000401","P000402","P000403","P000404","P000405","P000406","P000407","P000408","P000409","P000410",
    "P000411","P000412","P000413","P000414","P000415","P000416","P000417","P000418","P000419","P000420",
    "P000421","P000422","P000423","P000424","P000425","P000426","P000427","P000428","P000429","P000430",
    "P000431","P000432","P000433","P000434","P000435","P000436","P000437","P000438","P000439","P000440",
    "P000441","P000442","P000443","P000444","P000445","P000446","P000447","P000448","P000449","P000450",
    "P000451","P000452","P000453","P000454","P000455","P000456","P000457","P000458","P000459","P000460",
    "P000461","P000462","P000463","P000464","P000465","P000466","P000467","P000468","P000469","P000470",
    "P000471","P000472","P000473","P000474","P000475","P000476","P000477","P000478","P000479","P000480",
    "P000481","P000482","P000483","P000484","P000485","P000486","P000487","P000488","P000489","P000490",
    "P000491","P000492","P000493","P000494","P000495","P000496","P000497","P000498","P000499",
    "P004100","P004101","P004102","P004103","P004104","P004105","P004106","P004107","P004108","P004109",
    "P004110","P004111","P004112","P004113","P004114","P004115","P004116","P004117","P004118","P004119",
    "P004120","P004121","P004122","P004123","P004124","P004125","P004126","P004127","P004128","P004129",
    "P004130","P004131","P004132","P004133","P004134","P004135","P004136","P004137","P004138","P004139",
    "P004140","P004141","P004142","P004143","P004144","P004145","P004146","P004147","P004148","P004149",
    "P004150"
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
          Before calling, make sure you’re prepared to record. Take your time to get used to the script. After you’re ready, then you can start recording.
          </p>

          <p className="mb-4"> 
          <strong>To start recording, you need to call this number: 00 852 3848 3261</strong>
          </p>

          <p className="mb-4"> 
          Once you’ve called the number, the enter your ID and then add a “#” at the end. 
          Then, you can start reading the lines in your script. 
          Make sure to read them naturally and clearly as if you’re talking to someone. 
          You may add filler words or sounds like “lah”, “umm”, “ohh”, “hmm”, etc. 
          Don’t pause for too long between your lines in the scripts. 0.5-1 second is enough. 
          After you’ve finished recording, end the call. Take note of the date, time, and duration of the call.
          Here is the full guide containing the recording procedure:
          </p>

          <p className="mb-4"> 
          <strong>Here is the full guide containing the recording procedure: </strong>
          <a
            href="https://drive.google.com/file/d/1ojMWDPZOuXv2wSstUT6XgaAzupgJK5Br/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F5B3C] underline hover:text-[#0c4a31]"
          >
            General Recording Procedure
          </a>
          </p>

          <p className="mb-4"> 
          <strong>For Cantonese, the recording procedure is slightly different. Here's the guide for Cantonese: </strong>
          <a
            href="https://docs.google.com/document/d/1tFZBQog995CHcSnS7jy-bsnK7mXSm8n8RUVOtxtjXrU/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F5B3C] underline hover:text-[#0c4a31]"
          >
            Recording Procedure for Cantonese
          </a>
          </p>

          <p className="mb-4">
          <strong>After you’ve finished recording a script, you need to enter the recording data into this spreadsheet: </strong>
          <a
            href="https://docs.google.com/spreadsheets/d/1V41VNnYqZgkPchcFPmyomH1AKlWOSEEn7mrUjmTjpO0/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F5B3C] underline hover:text-[#0c4a31]"
          >
            Recording Data Spreadsheet
          </a>
          </p>

          <p>
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
              const value = e.target.value.replace("P","")
              setTypedID(value)
              setSpeaker(`P${value}`)
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