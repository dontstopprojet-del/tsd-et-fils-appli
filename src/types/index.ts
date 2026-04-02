export interface AppUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  echelon: string | null;
  birth_date: string | null;
  contract_date: string | null;
  contract_number: string | null;
  profile_photo: string | null;
  created_at: string;
}

export interface TarifHoraire {
  id: string;
  categorie: string;
  role: string;
  tarif_client_gnf: number;
  tarif_client_eur: number;
  salaire_horaire_gnf: number;
  date_creation: string;
}

export interface HeuresTravail {
  id: string;
  employe_id: string;
  intervention_id: string | null;
  date: string;
  nombre_heures: number;
  tarif_horaire_gnf: number;
  total_gnf: number | null;
  created_at: string;
}

export interface FichePaie {
  id: string;
  employe_id: string;
  mois: number;
  annee: number;
  total_heures: number;
  salaire_brut: number;
  retenue_18_pourcent: number;
  salaire_net: number;
  primes: number;
  avances: number;
  created_at: string;
  updated_at: string;
}
