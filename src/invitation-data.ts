export interface InvitationPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface InvitationData {
  general: {
    eyebrow: string;
    names: [string, string];
    description: string;
    date: string;
    note: string;
    scrollHint: string;
  };
  details: {
    eyebrow: string;
    title: string;
    day: string;
    schedule: {
      time: string;
      title: string;
      description: string;
    }[];
    venue: {
      eyebrow: string;
      name: string;
      address: string;
      note: string;
    };
  };
  gallery: {
    eyebrow: string;
    title: string;
    description: string;
    placeholderLabel: string;
    photos: InvitationPhoto[];
  };
  thanks: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
    signature: string;
    date: string;
  };
}

export const invitationData: InvitationData = {
  general: {
    eyebrow: "WE ARE GETTING MARRIED",
    names: ["Ngọc Dung", "Đăng Khoa"],
    description:
      "Together with our families,\nwe invite you to celebrate our wedding.",
    date: "JUNE 14 · 2027",
    note: "A new chapter, surrounded by our favourite people.",
    scrollHint: "SCROLL TO EXPLORE ↓",
  },

  details: {
    eyebrow: "SAVE THE DATE",
    title: "When & where",
    day: "Monday, June 14, 2027",
    schedule: [
      {
        time: "6:00 PM",
        title: "Dinner & celebration",
        description: "An evening of love, laughter, and dancing.",
      },
    ],
    venue: {
      eyebrow: "THE VENUE",
      name: "Hôtel Colline",
      address: "10 Phan Bội Châu, Xuân Hương \n Đà Lạt, Lâm Đồng",
      note: "Venue and address placeholder",
    },
  },

  gallery: {
    eyebrow: "A LITTLE OF OUR STORY",
    title: "Better together",
    description: "A few favourite moments on the way to forever.",
    placeholderLabel: "YOUR PHOTO HERE",
    photos: [
      {
        src: "images/image.jpg",
        alt: "Us together",
        caption: "Where it all began",
      },
      {
        src: "images/image.jpg",
        alt: "Our travels",
        caption: "Our little adventures",
      },
      {
        src: "images/image.jpg",
        alt: "Our engagement",
        caption: "The easiest yes",
      },
    ],
  },

  thanks: {
    eyebrow: "WITH ALL OUR LOVE",
    title: "Thank you",
    description:
      "For being part of our story.\nYour love and presence mean the world to us.",
    note: "We cannot wait to make more beautiful memories with you.",
    signature: "Dung & Khoa",
    date: "JUNE 14 · 2027",
  },
};
