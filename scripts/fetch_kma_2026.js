import fetch from "node-fetch";
import fs from "fs";

const URL = "https://edu.kma.org/edu/schedule";

function inferMode(venue=""){
  if(venue.includes("온라인") || venue.toLowerCase().includes("zoom")) return "온라인";
  if(venue.includes("온-오프") || venue.includes("병행")) return "하이브리드";
  return "오프라인";
}

async function run(){
  const res = await fetch(URL, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const html = await res.text();

  const events = [];
  const re = /(.+?)\s*평점\s*(\d+)\s*교육일자\s*(2026-\d{2}-\d{2})\s*기관명\s*(.+?)\s*장소\s*(.+?)(?=평점|교육일자|$)/g;

  let m;
  while((m = re.exec(html)) !== null){
    events.push({
      id: `${m[3]}-${m[1]}`.replace(/\s+/g,"-"),
      title: m[1].trim(),
      date: m[3],
      credits: Number(m[2]),
      organizer: m[4].trim(),
      venue: m[5].trim(),
      mode: inferMode(m[5]),
      source_url: URL
    });
  }

  fs.writeFileSync("events_2026.json", JSON.stringify(events, null, 2));
  console.log(`2026 일정 ${events.length}건 저장 완료`);
}

run();
