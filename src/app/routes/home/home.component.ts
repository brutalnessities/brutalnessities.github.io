import { Component } from '@angular/core';
const url = (str: string) => {
  return `https://drive.google.com/thumbnail?id=${str}&sz=w1000`;
};

interface Artwork {
  id: number;
  title?: string;
  imageUrls: string[];
  year: number;
  medium: string;
  dimensions?: string;
  location?: string;
  description?: string;
}

const hw = (hw: [number, number], metric = 'in') => {
  return `${hw[0]} ${metric} × ${hw[1]} ${metric}`;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  arr = [1, 2, 3, 4, 5];

  get artworks(): Artwork[] {
    return this._artworks.sort((a: Artwork, b: Artwork) => {
      if (b.year !== a.year) {
        return b.year - a.year;
      }
      return b.id - a.id;
    });
  }

  _artworks: Artwork[] = [
    {
      title: 'Study - Geopoliticus Child Watching the Birth of the New Man - Salvador Dali',
      year: 2012,
      medium: 'Acrylic on canvas paper',
      dimensions: hw([12, 9]),
      description:
        'High school art project tasked with recreating a portion of a famous painting. I chose to recreate the the blanket "covering" the child in the original painting.',
      imageUrls: [url('1LmdcP51t9eYPexhveQB1I7J8fPlXZ_LY')],
      id: 0,
    },
    {
      title: '51 Muns - Bombs and Guns',
      year: 2015,
      location: 'Osan Air Base, South Korea',
      medium: 'Acrylic Mural',
      dimensions: hw([10, 6], 'ft'),
      description: 'Mural painted in the living quarters of the 51st Munitions Squadron at Osan Air Base, South Korea.',
      imageUrls: [url('1IpivOnaGFl0ZqMyI2tj829Uy1f2_rpuP')],
      id: 1,
    },
    {
      title: 'Untitled',
      year: 2021,
      medium: 'Chalk on concrete',
      dimensions: hw([10, 6], 'ft'),
      imageUrls: [url('13vlDMg8Ul7XjtumjVagbNpW7GGTqvE9T')],
      id: 2,
    },
    {
      title: 'Untitled',
      year: 2021,
      medium: 'Silver, copper, gold',
      description:
        'Various jewelry pieces created in one semester of a jewelry class. cast silver and hammered gold, other techniques used to craft copper pieces.',
      imageUrls: [url('1ZNVeIWPxu7czfJA8YLCZuvqgnJAbWR1V')],
      id: 3,
    },
    {
      title: 'Alebrije',
      year: 2021,
      medium: 'Ceramic',
      dimensions: hw([8, 8]),
      description:
        "An alebrije is a brightly colored Mexican folk art sculpture of a fantastical creatures. They are combinations of real and imaginary animals, in this case, my dogs' head, and 8 snakes form the body of an octopus.",
      imageUrls: [url('1eel1pbIUiMiJX2OX57tz3jxMpjTsn5hH')],
      id: 4,
    },
    {
      title: 'Goat Skull',
      year: 2021,
      medium: 'Ceramic',
      description:
        'A different assignment, we were tasked with creating skulls and during the leather-hard stage of the clay, we were to carve designs.',
      imageUrls: [url('1aUtBVMFcjdrWGlClaDy5P2gAH6AT_fRn')],
      id: 5,
    },
    {
      title: 'Emma',
      year: 2022,
      medium: 'Ceramic',
      dimensions: hw([24, 12]),
      description: 'An attempt at creating a ceramic bust of a human face.',
      imageUrls: [url('1bV5uLciNRiww-vnS-ec6vZSxWyNJb6ls')],
      id: 6,
    },
    {
      title: 'Untitled',
      year: 2023,
      medium: 'Watercolor',
      dimensions: hw([11, 14]),
      location: '"The Rims", Billings, MT',
      description: 'On top of the "Rims" looking over the city of Billings, MT to the southwest',
      imageUrls: [url('1yPKkmr-pEL_RNi4sAvGLtaN67rvLtHkZ'), url('12ljgJ0yIGS4E-JADGLZJ7mZlsFrTeRX0')],
      id: 7,
    },
    {
      title: 'Untitled',
      year: 2024,
      medium: 'Watercolor',
      dimensions: hw([12, 9]),
      location: 'Billings, MT',
      description:
        'A view from the Yellowstone river on a trail near one of several oil refineries. The second painting is a mirror of the original',
      imageUrls: [url('1vLg1jhJfJ2is9dvJBFCCVHP0_0-si9J4'), url('1DnmJC6X65ZwerX-QW-CQMsYacNW5BzDu')],
      id: 8,
    },
    {
      title: 'Stairwell in the Biltmore Estate',
      year: 2023,
      medium: 'Watercolor',
      dimensions: hw([11, 14]),
      location: 'Biltmore Estate, Asheville, NC',
      imageUrls: [url('1oHSKNQSSWmvV8eNUi6p5ZRi5X_InNa9p')],
      id: 9,
    },
    {
      title: 'Untitled',
      year: 2023,
      medium: 'Watercolor',
      dimensions: hw([11, 14]),
      location: 'Billings, MT',
      description: 'A wintery view from my apartment',
      imageUrls: [url('1GVMsuvgdLWp6QosBsyKJXfE3hkZz4QNX')],
      id: 10,
    },
    {
      title: 'Untitled',
      year: 2024,
      medium: 'Watercolor',
      dimensions: hw([12, 9]),
      location: 'Billings, MT',
      description: 'New construction near my apartment',
      imageUrls: [url('1gOfA6y15e4CH-hHAum7AmemsWC4sPH11')],
      id: 11,
    },
    {
      title: 'Untitled',
      year: 2024,
      medium: 'Watercolor',
      dimensions: hw([12, 9]),
      location: 'Billings, MT',
      description: 'The field of grass/snow behind my apartment',
      imageUrls: [url('13yVuehthKc4dRw31CRTYfOb7GcQE9Gud')],
      id: 12,
    },
    {
      title: 'Untitled',
      year: 2024,
      medium: 'Watercolor',
      dimensions: hw([11, 14]),
      location: 'Billings, MT',
      description: 'A view from my apartment on a bright day',
      imageUrls: [url('1P6KcCKZnLTbEil_Yzm2n5pjCnlXdS5DX')],
      id: 13,
    },
    {
      title: 'Untitled',
      year: 2024,
      medium: 'Watercolor',
      dimensions: hw([10, 7]),
      description:
        'I wandered outside of town and paused at this site on a random road somewhere between Lockwood and Sheridan, WY.',
      imageUrls: [url('1uI7KbxO8GxI_KH42U0TayhI9molP4NBc')],
      id: 14,
    },
    {
      title: 'Untitled',
      year: 2023,
      medium: 'Watercolor',
      dimensions: hw([7, 10]),
      location: 'Billings, MT',
      description: 'My dog Chloe in her winter sweater sitting on the porch of my apartment',
      imageUrls: [url('1fYXHXUovQ3S8vvAxZyJV0P3lLPHm7Qrr')],
      id: 15,
    },
    {
      title: 'Untitled',
      year: 2023,
      medium: 'Watercolor',
      dimensions: '24 in × 12 in',
      location: 'Billings, MT',
      description:
        "Midnight lighting from a neighboring apartment buildings' garage. Construction and unmelted snow piles mixed with the light from the garages created a unique array of cast shadows.",
      imageUrls: [url('192K8-331GPDQBmh8hCY0LIKW4U2wDksr')],
      id: 16,
    },
  ];
}
