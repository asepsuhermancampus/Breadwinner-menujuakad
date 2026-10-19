import Image from "next/image";
export const portfolio = [
  { src: "/assets/images/generated.png", alt: "Potret pernikahan dalam busana tradisional" },
  {
    src: "/assets/images/stock-photo-1554047310-ab6170fc7b10.jpg",
    alt: "Detail cincin pernikahan",
  },
  {
    src: "/assets/images/stock-photo-1630164182887-042eed0019d1.jpg",
    alt: "Detail bunga pernikahan",
  },
];

export function VendorPortfolio({ onPhoto }: { onPhoto: (index: number) => void }) {
  const setPhoto = onPhoto;
  return (
    <section aria-label="Portofolio vendor" className="grid gap-5">
      <h2 className="text-xl font-semibold">Karya terkurasi</h2>
      <p className="text-sm text-secondary">
        Lihat foto yang digunakan pada katalog. Penggantian materi publik memerlukan pemeriksaan hak
        penggunaan dan moderasi.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {portfolio.map((value, index) => (
          <button
            key={value.src}
            className="relative h-64 overflow-hidden rounded-control"
            onClick={() => setPhoto(index)}
            aria-label={`Lihat portofolio ${index + 1}`}
          >
            <Image
              src={value.src}
              alt={value.alt}
              fill
              sizes="(max-width:640px) 85vw, 30vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
