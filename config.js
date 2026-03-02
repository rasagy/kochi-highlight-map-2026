var config = {
  style: "mapbox://styles/rasagy/cm60dix0k003s01sfb4ji5age",
  accessToken: "pk.eyJ1IjoicmFzYWd5IiwiYSI6ImNtbTlodjJwcTAzNG4yb3F3bzJveTBtc20ifQ.fj2KbtuKoyi6XVzMdGn3lQ",
  showMarkers: false,
  markerColor: "#2f8f62",
  inset: false,
  theme: "light",
  use3dTerrain: false,
  title: "Kochi Biennale Highlights",
  subtitle: "A scroll story of the locations and artworks I loved most",
  byline: "By Rasagy",
  footer: "Built with Mapbox GL JS storytelling. Update config.js to add more chapters.",
  chapters: [
    {
      id: "kochi-overview",
      alignment: "left",
      hidden: false,
      title: "Kochi, Kerala",
      image: "",
      description:
        "Kochi is where my Biennale journey starts. This opening view gives geographic context before zooming into specific venues and artworks.",
      location: {
        center: [76.2673, 9.9312],
        zoom: 10.5,
        pitch: 0,
        bearing: 0
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: []
    },
    {
      id: "fort-kochi-aspinwall",
      alignment: "left",
      hidden: false,
      title: "Fort Kochi Aspinwall",
      images: [
        {
          src: "assets/images/C1_Kochi_1.JPG",
          note: "Aspinwall courtyard mood at the start of my walk."
        },
        {
          src: "assets/images/C1_Kochi_2.JPG",
          note: "Details in this installation kept me standing for a long time."
        },
        {
          src: "assets/images/C1_Kochi_3.JPG",
          note: "One of my favorite visual moments from chapter 1."
        },
        {
          src: "assets/images/C1_Kochi_4.JPG",
          note: "Lighting and space design felt especially memorable here."
        }
      ],
      description:
        "Aspinwall in Fort Kochi is one of my favorite Biennale spaces. This chapter zooms in to the venue where several standout pieces left a strong impression.",
      location: {
        center: [76.24654, 9.96864],
        zoom: 16,
        pitch: 45,
        bearing: -20
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: []
    },
    {
      id: "artwork-placeholder-1",
      alignment: "right",
      hidden: false,
      title: "Artwork Placeholder 1",
      images: [
        {
          src: "assets/images/C2_Kochi_1.JPG",
          note: "Chapter 2 note: first perspective of this artwork."
        },
        {
          src: "assets/images/C2_Kochi_2.JPG",
          note: "Chapter 2 note: alternate angle with stronger contrast."
        }
      ],
      description:
        "Replace this with an artwork title and why you loved it. Keep the same chapter format for easy copy/paste additions.",
      location: {
        center: [76.24654, 9.96864],
        zoom: 17,
        pitch: 55,
        bearing: 12
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: []
    },
    {
      id: "artwork-placeholder-2",
      alignment: "right",
      hidden: false,
      title: "Artwork Placeholder 2",
      image: "",
      description:
        "Add your second favorite artwork here. You can also include an image URL in the image field.",
      location: {
        center: [76.2459, 9.9677],
        zoom: 17.2,
        pitch: 50,
        bearing: -30
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: []
    },
    {
      id: "artwork-placeholder-3",
      alignment: "right",
      hidden: false,
      title: "Artwork Placeholder 3",
      image: "",
      description:
        "Add your third favorite artwork chapter. Duplicate this block to keep expanding your story.",
      location: {
        center: [76.2482, 9.9692],
        zoom: 16.8,
        pitch: 40,
        bearing: 20
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: []
    }
  ]
};
