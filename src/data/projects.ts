export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  tag: string;
  services: string;
  year: string;
  credits: string;
  description: string[];
  homeImages: string[];
  gallery: string[];
  videoEmbed?: string;
}

export const HERO_SLIDES: string[] = [
  "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-60f7c783-c15a-4a63-82ba-f83be033e326.webp?h=386",
  "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-d87de8f5-cd5e-46eb-8785-54beb3b55f67.png?h=386",
  "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-46399d2f-6f48-4fcc-9c62-9e3b19c5883d.jpg?h=386",
  "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-b8931887-d29c-400f-810d-eea6d342a2fc.jpg?h=386",
  "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-bd340b3a-7e94-450f-9762-55fad997db34.jpg?h=386",
  "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-3da9a10a-229c-483e-8f3a-4fb55c769fb5.jpg?h=386"
];

export const SERVICES_LIST: string[] = [
  "Sculptures",
  "Paintings",
  "Anatomy & Form",
  "Jewelry Design",
  "Fine Art Teaching",
  "Residential Design",
  "Commercial Design",
  "Public Monuments",
  "Restoration",
  "Material Exploration",
  "Exhibitions",
  "Curatorial Work"
];

export const PROJECTS: Project[] = [
  {
    "id": "balladstudio",
    "slug": "balladstudio",
    "title": "Ballad Studio",
    "category": "Brand Identity, Visual Identity, Fashion",
    "tag": "Brand Identity",
    "services": "Creative Direction, Graphic Design",
    "year": "2024",
    "credits": "Project done for Ballad Studio",
    "description": [
      "Ballad, a name evoking a magical and mysterious ballad, originated in Barcelona as a handcrafted label defined by bold, expressive cuts. What began as a bespoke project quickly transitioned into styling for celebrities and influencers. Facing the evolution from an artisan atelier to a professional brand, the project required a strategic branding exercise to channel its growth and define its visual identity and universe."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-bd916210-9118-47fb-a798-63661eb10a39.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-b615b0e9-a3d8-4f10-ae40-c9a87d00f722.jpg?w=644",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-eeffe04a-1d5c-4f5c-96fe-75fa5a18d029.jpg?w=642"
    ],
    "gallery": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-a2a6083e-7676-4e33-83c9-c8290347cc76.jpg?w=1018&cX=0&cY=336&cW=3000&cH=3436",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-fa884a19-6686-4e56-8197-1933970cea8a.jpg?w=1652",
      "https://i.vimeocdn.com/video/2147991354-7db9546a7c7cbf8388767d0cd927c7d8fcfbca60018646fa0a08a1515ffd1053-d_1280?region=us",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-f656b97f-c5fa-49fc-95cf-38d844a5098a.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-40934055-99e5-4ccf-be2a-24902576a212.jpg?w=812",
      "https://i.vimeocdn.com/video/2147991920-b3638e5d183e41f9012d8dcfd22f252d009975da4ec643f02924f8f1d418cec4-d_1280?region=us",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-21e19b8e-2be9-4c06-9422-0c9ed5b6b93f.jpg?w=1652&cX=2.041742286751287&cY=0&cW=6745.916515426497&cH=4500",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-58c66bc1-a9a9-4eea-8f4f-8285bbdd33d1.jpg?w=1652&cX=1.466424682395882&cY=0&cW=6497.067150635208&cH=4334",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-a1b361e1-ca62-464d-b243-bea1f83426af.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-44d34603-22df-4556-ae68-0fbdf82996c5.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-aa76155c-b05e-4c74-9709-23b12fcc9ef6.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-1e59912b-d030-4491-8fed-2757f82596e7.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-dbc17e5a-6368-454f-99b5-758a9f0c0086.jpg?w=1652&cX=0.9600725952811899&cY=0&cW=3998.0798548094376&cH=2667",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-975a2038-1c91-49d7-91fb-6714ce48acb3.jpg?w=1652&cX=0.9600725952811899&cY=0&cW=3998.0798548094376&cH=2667",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-36add993-4d7a-48dd-a1c3-637b7b19ae43.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-5ca72044-31c9-4714-912e-9cbbeabcd175.jpg?w=1652&cX=0.9074410163341327&cY=0&cW=2998.1851179673317&cH=2000",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/69f22f002106f31e66b27e82/Am-eyy3WZq5aO0YrdbkpJ/poster.jpg"
    ]
  },
  {
    "id": "riseandfallofthemoon",
    "slug": "riseandfallofthemoon",
    "title": "The Rise and Fall of the Moon (Vol. I)",
    "category": "Packaging, Music Artwork",
    "tag": "Artwork",
    "services": "Creative Direction, Graphic Design",
    "year": "2026",
    "credits": "Released exclusively in vinyl format",
    "description": [
      "Artwork and overall design of the mixtape The Rise and Fall of the Moon (Vol. I) \u2014 an ambient music mixtape released exclusively in vinyl format."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-283b0865-ec63-4411-9689-d9d15024479e.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-14e3ca1f-299f-4318-8772-a279093a7e58.jpg?w=644",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-4c8be592-36d3-4d76-8051-5079a42146f3.jpg?w=642"
    ],
    "gallery": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-4deb7f06-91c8-41b1-9ea4-c30d1a998954.jpg?w=1018&cX=0&cY=233&cW=4500&cH=5154",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-74999ec8-98a9-40b9-89b5-eb91c7e9cf41.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-65725348-add0-43aa-ae4d-57f3865d123d.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-115cd1aa-1908-4190-8355-2fa2e8679a56.jpg?w=1652&cX=0&cY=323&cW=8000&cH=4978",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-411c5579-87de-4492-9caf-009303f5f9fc.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-8cb634c7-2024-4143-87b1-4c56b657a18a.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-a9747e95-c83e-4c58-9f6a-d3841e5fb84f.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-6618692e-a138-4c30-9274-514c65646ad2.jpg?w=812"
    ]
  },
  {
    "id": "solyddigital",
    "slug": "solyddigital",
    "title": "Solyd Digital",
    "category": "Visual Id, Branding",
    "tag": "Brand Identity",
    "services": "Graphic Design, Art Direction, Motion, 3D",
    "year": "2023",
    "credits": "Project done at Morillas Branding",
    "description": [
      "Visual identity for Solyd Digital, a leading tech partner offering a range of customizable services, from ERP implementation to tailor-made development.",
      "To visually communicate the adaptability of Solyd Digital\u2019s custom-made products and specialized support, the logo and visual language was born from geometric shapes with a technological character that evolve and adapt their forms. These elements come to life through a motion system, bringing flexibility and dynamism to represent the brand concept: \u201cTailoring Solutions.\u201d",
      "Color and silhouettes take center stage, creating a bold and disruptive digital identity. The geometric forms became the cornerstone of the brand\u2019s graphic design, expressed through 2D animations and striking 3D surfaces that add depth and a modern touch.",
      "The balanced integration of these elements results in an outstanding identity with a dynamic and digital personality, positioning Solyd Digital as a pioneer and setting a new standard in the industry."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-850d3666-4e55-46eb-8e2b-f8ecdf0b9ae3.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-8e542ad8-7b98-469b-98bc-60037a3f5f84.jpg?w=642"
    ],
    "gallery": [
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828c4f3bcd53c03e247478f/sehFsOkSjWvkLHvJ_r91O/poster.jpg",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828c8e4b7af996cdb1d3b98/gfblN8qENbjcyLRKT5Bxc/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-224fbb72-2a9c-49af-946a-62c5d240ef3c.jpg?w=1652&cX=4&cY=0&cW=6192&cH=3486",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-7dba29f2-2af3-415c-80d8-c7e215b8b84f.jpg?w=812&cX=4&cY=0&cW=7406&cH=9267",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-5e6ab336-346f-4565-afaa-c66b9a588aa1.jpg?w=812&cX=2.3149606299211882&cY=0&cW=4496.370078740158&cH=5626",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-21604784-2788-450f-ad59-fa85e3457a64.jpg?w=1652&cX=0&cY=25&cW=7333&cH=4901",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-e3982bca-f398-4b85-a076-c984b5d9e3fc.jpg?w=1652&cX=0&cY=0&cW=8334&cH=5569",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828cfdc81e9171fb421cedb/f1-J4x2BBrAKk4rkTaaS9/poster.jpg",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828ce52bf8e12e6e1c2c1a7/CbCbIuyYzRfUTVzuisRwD/poster.jpg",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828d4cb60d0dd1e3294d5b6/mM9A84D3NnB6NL3futTRr/poster.jpg",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828d58bc14ca67f5b42ecc6/oPvBNI8rko0z2hl_ck0pc/poster.jpg",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828d58b115a662e0b3e9f0f/vGdndDH-30vukPE-I88_w/poster.jpg",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828d6af08bd6b24dc81b811/tKzq_ciBLFNlx4B-u6Hxy/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-03e3bdec-4b34-43d0-9653-fac6f1fad522.jpg?w=1654",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-a80753f7-58ce-4a13-9b43-f7fdd582cc65.jpg?w=1652&cX=3&cY=0&cW=7994&cH=4500",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-994d9615-231b-4abc-b183-506840a33dc6.jpg?w=812&cX=2&cY=0&cW=4496&cH=5625",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-7b798784-8232-40f1-b52e-8d9146367069.jpg?w=812&cX=2&cY=0&cW=4496&cH=5626",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828df5229eddfe628c8fc1d/JiLBgC_ueQqRdtVTyW1nD/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-5108b56d-f96d-4af3-be12-c9f67095fe5d.jpg?w=1652&cX=3.690322580644988&cY=0&cW=7492.61935483871&cH=4218",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6828e0fbb1559ac390809bd2/5Z5hUJ3OU0RfET3Qd8qMT/poster.jpg"
    ]
  },
  {
    "id": "alaire-visualuniverse",
    "slug": "alaire-visualuniverse",
    "title": "Alaire",
    "category": "Visual Universe, Branding",
    "tag": "Visual Universe",
    "services": "Graphic Design",
    "year": "2023",
    "credits": "Project done in collaboration with Laura Pascual",
    "description": [
      "Branding and Visual Identity for Alaire.",
      "A brand born from the merge of the Mediterranean feeling and an identity that captures the essence of living at your own pace."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-ddd10710-d36c-48c0-bc62-0e9e11fcb6e9.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-ffb72100-3356-4c47-9759-4509e53fc7d4.jpg?w=644",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-830133a1-2d7c-4a37-b695-46ebc114ce98.jpg?w=642"
    ],
    "gallery": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-ac985e66-4d87-49f3-9084-b75fe5832786.jpg?w=1018&cX=0&cY=235.38801571709246&cW=4500&cH=5154.223968565815",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-51e4e01b-ff81-4768-ba1f-0a6650a2a147.jpg?w=1650",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-cfdf856b-41d7-48fa-8bc2-dc1b10639678.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-41617634-1f68-4c4a-8472-2f880ba7548d.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-9b9c7b49-f9cd-49e9-9341-0fac9c8eb6c3.jpg?w=1650&cX=0&cY=1&cW=2890&cH=1930",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-7ea694be-65ea-48e1-a74c-4af52803c6d8.jpg?w=812",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/682cdbd34e2b6b3880ce1a61/jkQA5HIsnZSBd-zr-FFss/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-3f0b0308-cc93-4c29-95e6-844453c63414.jpg?w=1652&cX=0&cY=3&cW=8333&cH=5619",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-76b19c30-1672-4800-8a5d-df9ee47115d8.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-e36e4be6-aa98-47bb-8907-417ced347e82.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-73cb7dce-1408-4739-b94f-f67faf600ae7.jpg?w=1652&cX=0&cY=2.8868038740920383&cW=8333&cH=5619.226392251816",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-bb21b027-2d43-4c3f-b629-993a2f360167.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-0415a9ed-2c16-4a46-8a68-57d55245cd1c.png?w=812&cX=0&cY=2.837438423645267&cW=1482&cH=1854.3251231527095"
    ]
  },
  {
    "id": "binomial-videomanifesto",
    "slug": "binomial-videomanifesto",
    "title": "Binomial - Menos Bullshit m\u00e1s Skincare [Video Manifesto]",
    "category": "Film, Branded Content",
    "tag": "Video Manifesto",
    "services": "Creative Direction, Art Direction, Video Edit, VFX, SFX",
    "year": "2024",
    "credits": "Project done at Morillas Branding",
    "description": [
      "Creative direction and concept for the launch video of Binomial, where the concept of duality comes to life through the interplay of light and shadow\u2014revealing truths about skincare, just as the brand balances nature and innovation.",
      "The visual style is inspired by what resonates with Generation Z, and every detail reflects Binomial\u2019s mission: simple, effective skincare that cuts through the noise and debunks the myths."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-96fd2da9-ee1c-4b95-8e8e-c90ff39ef2a2.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-0edbecc2-23f2-498c-8515-515fb272ca81.jpg?w=642"
    ],
    "gallery": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-2eb56bed-a67f-4bc9-9897-ac68ec16bbf1.png?w=1018&cX=533&cY=0&cW=1579&cH=1808",
      "https://i.vimeocdn.com/video/2016884324-f0716c500e420b6d481fd9340c52dbde827557dc8bf9ba698732bf7e76025f42-d_1280?region=us",
      "https://i.vimeocdn.com/video/2016886697-6750bd503a198c590a243a07b651d84d0b49cb9ade7772bdcd44a7061b1a85b0-d_1280?region=us",
      "https://i.vimeocdn.com/video/2016886796-9982a309ec3fd5efd0ca79dd4af2797aeccb7bf9e4f33526449eaa3c0cf5478b-d_1280?region=us",
      "https://i.vimeocdn.com/video/2016886825-4be6f3a4d64561b0fe686b994dff7e19f367bad6dafcbb996bd898efd3e00391-d_1280?region=us",
      "https://i.vimeocdn.com/video/2016886760-21161263d6e92e233330327fae99466957e8b18d59f3cea2cc986c75fc6e0418-d_1280?region=us",
      "https://i.vimeocdn.com/video/2016886839-ab302d52265d7f0b2d92c9f3b604de880f6280761caff8a2ac267a1a360078ce-d_1280?region=us"
    ]
  },
  {
    "id": "amainabrandidentity",
    "slug": "amainabrandidentity",
    "title": "Amaina Spa",
    "category": "Visual Id, Branding, Photography",
    "tag": "Brand Identity",
    "services": "Graphic Design, Art Direction, Motion",
    "year": "2023",
    "credits": "Project done at Morillas Branding in collaboration with Laura Pascual",
    "description": [
      "Brand identity for Amaina (The Spa at Hotel Marina Badalona) \u2014 a project that creates an entire metaphorical universe, transporting us to an oasis of tranquility.",
      "To bring this feeling of relaxation to life, we captured the calm that follows a period of stress through the concept of \u201cthe last drop of the storm.\u201d This inspired the name Amaina, which in Spanish means the end or moderation of a storm, and in this case signifies the departure of negativity and the arrival of absolute relaxation.",
      "We also developed a visual language that mirrors the sinuous forms of a drop falling into water, with a central tension that gradually dissipates until it vanishes completely. This approach allows for the creation of fluid compositions, drawing a visual poetry that evokes pure calm."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-450245a3-b3c9-467a-8f55-27f9cb46ea67.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-4156a98f-a9cb-43dc-aa89-b8832a893cb6.jpg?w=642"
    ],
    "gallery": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-90839655-1293-48d4-b025-5d279919207e.jpg?w=1018&cX=285.5917667238423&cY=0&cW=3928.8164665523154&cH=4500",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6829b3fcf1162d083971d2c2/TF0eikL37weoIqGQl8Sm5/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-1fa4514e-c745-4757-90e1-ced26f8abd24.jpg?w=1652&cX=0&cY=3&cW=8333&cH=5619",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-0a6a2f68-a45b-4106-a5db-e4f4c63ef4ae.jpg?w=812",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6829b5e43c5fb1f3bfd85516/byomdX5vPlyiPqESA0I07/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-c31c188c-a1c3-4303-8429-f2e9fb9d783e.jpg?w=1652&cX=0&cY=2.8868038740920383&cW=8333&cH=5619.226392251816",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-cabbf945-b157-4729-a001-45b1b1d6246b.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-25249cf6-60d9-4bd0-ab14-31bd6576f5dc.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-d7eb208c-ca1b-4cfb-af37-840aa2bb1750.jpg?w=1650"
    ]
  },
  {
    "id": "binomial-photographylaunchcampaign",
    "slug": "binomial-photographylaunchcampaign",
    "title": "Binomial - Photography Launch Campaign",
    "category": "Photography, Branded Content",
    "tag": "Photography",
    "services": "Creative Direction, Art Direction",
    "year": "2024",
    "credits": "Project done at Morillas Branding",
    "description": [
      "Creative direction for the launch campaign of Binomial skin. Channeling the tone and energy of Generation Z through bold photography and art direction, using lifestyle imagery that embodies the brand\u2019s personality, while the product shots play with reflections, light, and shadow\u2014elevating the product and reinforcing the brand\u2019s core concept: beauty for all."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-aec17d1a-f7aa-4f8a-92ea-29a531cf6fa0.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-cf9ce1bb-eb4a-4a81-9b6f-6ec990fc53cb.jpg?w=644",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-058aaf95-5cb9-4672-9118-f29e160a28f7.jpg?w=642"
    ],
    "gallery": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-4c882cb7-e6ea-4275-9ae9-cd51217ae4ca.jpg?w=1018&cX=0&cY=235.38801571709246&cW=4500&cH=5154.223968565815",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-869298b1-481f-421f-a599-3d3afe35e16a.jpg?w=812&cX=2&cY=0&cW=4496&cH=5625",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-cfeb730e-cdb5-42b3-b344-1d8979c4058a.jpg?w=812&cX=2&cY=0&cW=4496&cH=5625",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-127af485-d286-4d16-bccf-ed81cb2d4d07.jpg?w=812",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6829dce6c14ca67f5b57c04d/4hITiIo5gjmBlkRfJ9oLt/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-4f21068a-f611-48c1-894e-675fc06cab9e.jpg?w=812&cX=2.2145669291335253&cY=0&cW=4495.570866141733&cH=5625",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-c34a639a-e1ea-4574-bafa-041b033d25e7.jpg?w=812&cX=2.2145669291335253&cY=0&cW=4495.570866141733&cH=5625",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-45f0fdf2-f0b4-43a8-ab13-f1d0aca0ef11.jpg?w=812&cX=2.2145669291335253&cY=0&cW=4495.570866141733&cH=5625",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-ed237841-4dfa-4044-a531-c84a7ac00b1d.jpg?w=812&cX=2.2145669291335253&cY=0&cW=4495.570866141733&cH=5625"
    ]
  },
  {
    "id": "fideworlchesschampionship2021-visualuniverse",
    "slug": "fideworlchesschampionship2021-visualuniverse",
    "title": "FIDE World Chess Championship 2021",
    "category": "Visual Identity, Campaign Design, Visual Universe",
    "tag": "Visual Universe",
    "services": "Graphic Design, Motion",
    "year": "2021",
    "credits": "Project done at Morillas Branding",
    "description": [
      "Visual identity for the 2021 edition of the FIDE World Chess Championship.",
      "In chess, every move leaves a trace, so with this in mind the movements of the pieces were framed as the core graphic concept for the identity, reinforced by a powerful claim: \u201cYOU ARE YOUR BEST MOVES.\u201d",
      "From there, the identity came to life by representing the claim at a large scale, acting as a metaphorical chessboard (through the combination of black and white), and visually working with the literal trails of the moves drawn across it.",
      "The typography (Apoc \u2013 @blazetype) was chosen for its balance between sophistication and strength, capturing the blend of sport and intellect that chess demands."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-965a96e7-789f-4318-97f6-6c1737be7f52.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-bc6b87d8-21d1-419b-a36c-ae3e3fa29906.jpg?w=642"
    ],
    "gallery": [
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/68347bf8dfaa31ac0ea9059a/RANYyYuesyAy2PnfwlrfY/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-733b62b5-f800-4401-b724-eac74298ec3a.jpg?w=1652",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/68347c78d44f91369b54414b/dC_WUkDWey5SDdJGBC7IR/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-79bf448f-73a9-4678-966c-3c698f339337.jpg?w=812&cX=1.0767716535433465&cY=0&cW=2997.8464566929133&cH=3751",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-88cce521-c231-4727-8c59-0ed26ee780b1.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-90244d6a-a374-4b34-a3b5-14e4905a6e00.jpg?w=1652",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/68347ea8f0d6dd0bb95f28c1/0udFFTSlSyAqXhVI01-V2/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-13595d6d-a926-4010-aa8b-b5e1c32287a3.jpg?w=812&cX=1.2303149606300394&cY=0&cW=2497.53937007874&cH=3125",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-570c4d58-9f2b-4b71-a14f-eed3e47117c3.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-2d6c3b3e-5774-4ce0-a464-bd3c7ad68018.jpg?w=812&cX=0&cY=0.15763546798029893&cW=4500&cH=2737.6847290640394",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-ad7541a0-883e-44e1-bf08-9ec1c4c7d26a.jpg?w=1652&cX=0&cY=1&cW=3000&cH=1998",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-750f27d0-2e8d-4390-90a2-b590d2471db0.jpg?w=644",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-78d23ca2-a26d-48c2-93fd-eb65a6f7ab15.jpg?w=1652&cX=1&cY=0&cW=3069&cH=2047",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/68348c309002a002af065dc7/g8SzmtR_7_LwZLNbPr60x/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-948793d6-fd3f-4a18-b9b8-bea886caea01.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-2b58f61c-f0d0-47e4-af71-a13e4b3e644e.jpg?w=1652&cX=0&cY=129.80750605326887&cW=2500&cH=1407.3849878934623"
    ]
  },
  {
    "id": "hymnofrebellion-musicvideo",
    "slug": "hymnofrebellion-musicvideo",
    "title": "Tildo Muxart - Hymn of Rebellion [Music Video]",
    "category": "Film",
    "tag": "Music Video",
    "services": "Creative Direction, Art Direction, Video Edit, VFX, SFX",
    "year": "2022",
    "credits": "Music Video for Tildo Muxart",
    "description": [
      "For Hymn of Rebellion we worked hand to hand with the artist \u201cTildo Muxart\u201d to generate a world surrounding the theme of the song, the rebellion, and dividing it into 3 acts that represent the 3 pillars of society: education, family and religion.",
      "The most transcendental argument is religion, since it is one of the values that has always shaped the rest. For this reason, we created a parallelism with the fall of the rebellious angels and represented it as a takeover of the church made by all those groups that have been historically marginalized. And leading the rebellion there is the artist impersonating Lucifer, leader of perversion."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-cac955cb-f076-476a-bdfd-933e46c7ce10.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-2c10fd89-3ae8-422a-874d-7b243be4c478.jpg?w=642"
    ],
    "gallery": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-67e84e69-47cd-42bd-9577-208d31b0c716.jpg?w=1018&cX=82&cY=264&cW=2314&cH=2650",
      "https://i.ytimg.com/vi/44Dxeb7ormM/hqdefault.jpg"
    ],
    "videoEmbed": "https://www.youtube.com/embed/44Dxeb7ormM"
  },
  {
    "id": "hymnofrebellion-visualuniverse",
    "slug": "hymnofrebellion-visualuniverse",
    "title": "Tildo Muxart - Hymn of Rebellion",
    "category": "Visual Universe, Music Artwork, Credit Titles",
    "tag": "Visual Universe",
    "services": "Creative Direction, Art Direction, Photography Direction, Graphic Design",
    "year": "2023",
    "credits": "Photography: Diego Canales | Type design: Llu\u00eds Domingo",
    "description": [
      "For Hymn of Rebellion we worked hand to hand with the artist \u201cTildo Muxart\u201d to generate a world surrounding the theme of the song, the rebellion, and dividing it into 3 acts that represent the 3 pillars of society: education, family and religion.",
      "With that in mind we shaped that character to become the main villain of the story and generated a whole imaginary around it, translating it into art and graphics, present in artworks, music video and promotional material."
    ],
    "homeImages": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-d4368014-ba36-46c9-af30-6d4b2ee709a3.jpg?w=642",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-97090f2c-5df6-4bb6-ad73-0498ebbfbb2b.jpg?w=642"
    ],
    "gallery": [
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-1331d86c-c805-4545-ae61-d5c6cab60760.jpg?w=1018&cX=0&cY=187.61689587426326&cW=2000&cH=2290.7662082514735",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-04b142c7-52ed-495c-ba4d-2c85075608ac.jpg?w=644",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-766bae59-cf5d-44e6-894d-2db2ce72e354.jpg?w=812",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/682ee943a5034393449919d2/rIsc-O9Y1rpwEu7RldfEH/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-4fda3030-7fec-461c-889d-c70892f3f5c2.jpg?w=1650",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-9e6c5389-cab9-4702-bbe5-2a719ee09a88.jpg?w=812",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/682f3cc8a5630c294a67cd2c/odJctORDq4GgU0bNYaAZE/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-572daacd-a7ae-4a96-ab6a-5292500fc9cd.jpg?w=1650",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/682f513c0582fb00b8950c43/yV8BkaettQCGGQYkQHdv4/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-67c9e38f-4016-4b15-9d23-ae5db4d2d061.jpg?w=812",
      "https://v-p.rmcdn1.net/6719169732eee58ca71f4a43/671916d1a071701ddd12a884/6834c26d27f8eedc54aae390/w0q_jNMIJKiboCqY4cMhm/poster.jpg",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-c2af4e28-1a86-4f92-ae4c-eb40a47831bf.jpg?w=812",
      "https://i-p.rmcdn.net/6719169732eee58ca71f4a43/5068024/image-42f08f77-d966-44e2-a754-01d1e1c22386.jpg?w=812"
    ]
  }
];
