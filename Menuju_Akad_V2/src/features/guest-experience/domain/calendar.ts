export function downloadGuestCalendar() {
  const contents = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Menuju Akad//Undangan//ID",
    "BEGIN:VEVENT",
    "UID:andi-risa-20270214@menujuakad.example",
    "DTSTAMP:20261025T030000Z",
    "DTSTART:20270214T010000Z",
    "DTEND:20270214T070000Z",
    "SUMMARY:Pernikahan Andi & Risa",
    "LOCATION:Bumi Samami\\, Bandung",
    "DESCRIPTION:Akad 08.00–09.00 WIB. Resepsi 10.00–14.00 WIB. Konfirmasi rincian kepada pengirim.",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([contents], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "andi-risa-14feb2027.ics";
  link.click();
  URL.revokeObjectURL(url);
}
