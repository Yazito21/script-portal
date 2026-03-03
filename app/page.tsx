"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [language, setLanguage] = useState("")
  const [speaker, setSpeaker] = useState("")
  const [scripts, setScripts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchScripts = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .eq("language", language)
      .eq("speaker", speaker)
      .order("id", { ascending: true })

    if (error) {
      console.error(error)
      alert("Error fetching scripts")
    } else {
      setScripts(data || [])
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Script Portal</h1>

        <input
          type="text"
          placeholder="Language (e.g. Malay)"
          className="w-full border p-3 rounded mb-4"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />

        <input
          type="text"
          placeholder="Speaker ID (e.g. #000481)"
          className="w-full border p-3 rounded mb-4"
          value={speaker}
          onChange={(e) => setSpeaker(e.target.value)}
        />

        <button
          onClick={fetchScripts}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "View Scripts"}
        </button>

        {scripts.length > 0 && (
          <div className="mt-8 space-y-4">
            {scripts.map((script) => (
              <div key={script.id} className="border p-4 rounded">
                <p className="font-semibold">
                  {script.script_name} — {script.role}
                </p>
                <p className="mt-2">{script.text}</p>
              </div>
            ))}
          </div>
        )}

        {scripts.length === 0 && !loading && (
          <p className="mt-6 text-gray-500 text-sm">
            No scripts found.
          </p>
        )}
      </div>
    </div>
  )
}