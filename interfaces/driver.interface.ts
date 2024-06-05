

export interface ICar {
    _id: string;
    model: string;
    engine: string;
    torque: number;
    hp: number;
    activeFrom: string;
    activeTo: string | null
  }
  
  export interface IDriver {
    _id: string;
    firstName: string;
    lastName: string;
    slug: string
    birthday: string | null;
    createdAt: string;
    raceNumber: number | null;
    cars: ICar[]
    nationality: string
  }
  