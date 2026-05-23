/**
 * config.js
 * Organize all your media links and API keys here!
 */

const CONFIG = {
    // 1. Google Drive API Key
    GOOGLE_DRIVE_API_KEY: 'AIzaSyA4oQW9br12N5drj0n9LbdAO0FpHT6vW8w',

    // 2. Home Page Image
    // Replace this link with your landscape photo URL for the home page background
    HERO_IMAGE: 'https://drive.google.com/file/d/16xR4x4AP0CfgE1dL39tMuDAoFBtAWiAB/view?usp=sharing',

    // Replace this link with your portrait photo URL for mobile screens (Optional)
    // If left empty, it will default to using the HERO_IMAGE above on phones.
    HERO_IMAGE_MOBILE: 'https://drive.google.com/file/d/1gS0yVyJOR7Hq69k2rrB8ZVdkdFwSwNdE/view?usp=sharing',

    // 2. Navigation & Media
    // Define your tabs here! You can add as many tabs as you want.
    // Valid types: "youtube", "google_drive_photo", "google_drive_video", "image"
    TABS: [
        {
            name: "Photos",
            items: [
                {
                    title: "Highlights",
                    type: "google_drive_photo",
                    link: "https://drive.google.com/drive/u/2/folders/17QSue320msSr660H-_E72CHnHYDTVHzL"
                },
                {
                    title: "Swarada's Haldi",
                    type: "google_drive_photo",
                    link: "https://drive.google.com/drive/u/2/folders/1Rzm0lWbC-rF6Z-aTh0ZuIlBPQJnfJZdR"
                },
                {
                    title: "Dholki Night",
                    type: "google_drive_photo",
                    link: "https://drive.google.com/drive/u/2/folders/1P8UKvLMT5FDjbPh2kHydj0rG078H1pc2"
                },
                {
                    title: "Mehandi",
                    type: "google_drive_photo",
                    link: "https://drive.google.com/drive/u/2/folders/1VKUkfAEpejNRm4VIpzblZZmlMzl6frOo",
                    link_2: "https://drive.google.com/drive/u/2/folders/1nI7zUx2aViEZZgTL3bIYH3QROKJvFc4G"
                },
                {
                    title: "Ring Ceremony & Sangeet",
                    type: "google_drive_photo",
                    link: "https://drive.google.com/drive/u/2/folders/1lwclNWA91yn2ePzNu70oyFL__E4PfGq-",
                    link_2: "https://drive.google.com/drive/u/2/folders/1xL-7ULuIL3HFk8d4hvyF_mtCAZ7bpCU8",
                    link_3: "https://drive.google.com/drive/u/2/folders/1-6YxLxSgAc-BASslWJSmJHox7b83L0-E",
                    link_4: "https://drive.google.com/drive/u/2/folders/12BBk84la9rXrjCbNec2ZN261feJwbhzp"

                },
                {
                    title: "Wedding Day",
                    type: "google_drive_photo",
                    link: "https://drive.google.com/drive/u/2/folders/158BwL1ipk89sA0xWEaE2ZMzCU-zCrpBs",
                    link_2: "https://drive.google.com/drive/u/2/folders/1fqXDU0TjQNFLxVIiPqntG9n4pxGZRXWl",
                    link_3: "https://drive.google.com/drive/u/2/folders/10fZ20UO_aPvjXukhHfll49g6i74wKxWz",
                    link_4: "https://drive.google.com/drive/u/2/folders/1OAZeFJuVcpF4fW-uB3D9olxs973c_9mr",
                    link_5: "https://drive.google.com/drive/u/2/folders/1fiRx9EPznUaehuhy94yP-6tcRrdL-dL_",
                    link_6: "https://drive.google.com/drive/u/2/folders/1jpIDmfEWZY_e7KXZqEEWaoFpJLgTGpF3"
                },
                {
                    title: "Reception",
                    type: "google_drive_photo",
                    link: "https://drive.google.com/drive/folders/1V8rPsA8bdsNaN5uGUClSfUqQSZI8QIUL?usp=sharing"
                },
                {
                    title: "Pictures Taken on Phones",
                    type: "google_drive_photo",
                    link: "https://drive.google.com/drive/folders/1DDec47gniArSwx_-IiIA-b1LBV_QM6Du",
                    link_2: "https://drive.google.com/drive/u/2/folders/1EJRkxQONASqY4J-JCHICrahoBHgBWrnx"
                }
            ]
        },
        {
            name: "Videos",
            items: [
                {
                    title: "Wedding Highlight Video",
                    type: "youtube",
                    link: "https://www.youtube.com/watch?v=YvaHFvWJV8k&list=PLEn7yLxg8bY4JaGTWkU44U7qjVQ9CzfBB"
                },
                {
                    title: "Dholki Night",
                    type: "youtube",
                    link: "https://www.youtube.com/watch?v=QEPVXcIkufk&list=PLEn7yLxg8bY4JaGTWkU44U7qjVQ9CzfBB&index=2"
                },
                {
                    title: "Swarada's Haldi",
                    type: "youtube",
                    link: "https://www.youtube.com/watch?v=7IQisYsVcSg&list=PLEn7yLxg8bY4JaGTWkU44U7qjVQ9CzfBB&index=7"
                },
                {
                    title: "Mehandi",
                    type: "youtube",
                    link: "https://www.youtube.com/watch?v=ZbYABSkPADg&list=PLEn7yLxg8bY4JaGTWkU44U7qjVQ9CzfBB&index=3"
                },
                {
                    title: "Ring Ceremony & Sangeet",
                    type: "youtube",
                    link: "https://www.youtube.com/watch?v=1NLubxF9eaU&list=PLEn7yLxg8bY4JaGTWkU44U7qjVQ9CzfBB&index=4"
                },
                {
                    title: "Sargun's Haldi",
                    type: "youtube",
                    link: "https://www.youtube.com/watch?v=ueiXHWx_J38&list=PLEn7yLxg8bY4JaGTWkU44U7qjVQ9CzfBB&index=5"
                },
                {
                    title: "Wedding Day",
                    type: "youtube",
                    link: "https://www.youtube.com/watch?v=AB-_0TcISyg&list=PLEn7yLxg8bY4JaGTWkU44U7qjVQ9CzfBB&index=6"
                },
                {
                    title: "Reception Highlights",
                    type: "google_drive_video",
                    link: "https://drive.google.com/drive/folders/10pnEO51X5yZDaQ7bR-xT_vgAlpS7VntM"
                },
                {
                    title: "Misc Phone Videos",
                    type: "google_drive_video",
                    link: "https://drive.google.com/drive/folders/1DEuWJox4ZWRc9eG10v-JHQbS5LqgjsUq"
                }
            ]
        }
    ]
};
