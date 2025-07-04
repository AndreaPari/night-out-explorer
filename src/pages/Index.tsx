import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Star, Tag, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddSpotModal } from '@/components/AddSpotModal';
import { FilterModal } from '@/components/FilterModal';
import { BulkImportModal } from '@/components/BulkImportModal';

export interface NightlifeSpot {
  id: string;
  name: string;
  city: string;
  category: string;
  cuisine: string;
  zone: string;
  tags: string[];
  comments: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  dateAdded: string;
}

const initialSpots: NightlifeSpot[] = [
  // Bere post cena
  { id: '1', name: 'The flat by Macan', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['post cena'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '2', name: 'Bar Nico', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['post cena'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '3', name: 'OttO', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['post cena'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '4', name: 'Organics sky garden', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['post cena', 'sky garden'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '5', name: 'Fuori Mano', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['post cena'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '6', name: 'Est bar', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['post cena'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '7', name: 'Carico', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['post cena'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '8', name: 'Blusquare', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['post cena'], comments: '', rating: 4, dateAdded: new Date().toISOString() },

  // Cena
  { id: '9', name: 'Ginmi', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['korean'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '10', name: 'Roppongi', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['japanese'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '11', name: 'La dogana del buongusto', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['stata'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '12', name: 'Osteria alla concorrenza', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '13', name: 'Pescherie riunite mercato con cucina', city: 'Milano', category: 'dinner', cuisine: 'mediterranean', zone: '', tags: ['seafood'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '14', name: 'Osteria Serafina', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '15', name: 'Vino al vino', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['wine bar'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '16', name: 'Le nove scodelle', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '17', name: 'Zaza ramen', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['ramen', 'japanese'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '18', name: 'Nozomi ramen', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['ramen', 'japanese'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '19', name: 'Trattoria al Laghett', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['favorite'], comments: '♥️', rating: 5, dateAdded: new Date().toISOString() },
  { id: '20', name: 'Da aladino', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '21', name: 'JinYong', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '22', name: 'Okja', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['korean'], comments: 'coreano!', rating: 4, dateAdded: new Date().toISOString() },
  { id: '23', name: 'SEON', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['korean', 'highly recommended'], comments: 'coreano super consigliato', rating: 5, dateAdded: new Date().toISOString() },
  { id: '24', name: "Lee's bikiki", city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['korean'], comments: 'coreano', rating: 4, dateAdded: new Date().toISOString() },
  { id: '25', name: 'Conchetta', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '26', name: 'El brellin', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '27', name: 'Trattoria La Piola', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '28', name: 'Osteria del treno', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '29', name: 'Piccolo', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: 'Moscova', tags: [], comments: 'zona Moscova', rating: 4, dateAdded: new Date().toISOString() },
  { id: '30', name: 'Trattoria amici miei', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '31', name: 'Testina', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '32', name: 'Arlati', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['special'], comments: '!', rating: 5, dateAdded: new Date().toISOString() },
  { id: '33', name: 'Li sei deli', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['korean'], comments: 'coreano', rating: 4, dateAdded: new Date().toISOString() },
  { id: '34', name: 'Ajumma taekbokki', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['korean', 'standing'], comments: 'stata solo in piedi', rating: 4, dateAdded: new Date().toISOString() },
  { id: '35', name: 'DaV', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '36', name: 'The fish', city: 'Milano', category: 'dinner', cuisine: 'mediterranean', zone: '', tags: ['seafood'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '37', name: 'Abbottega', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '38', name: 'Muu house', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '39', name: 'Merissi', city: 'Milano', category: 'dinner', cuisine: 'other', zone: '', tags: ['georgian', 'visited'], comments: 'georgian, andata', rating: 4, dateAdded: new Date().toISOString() },
  { id: '40', name: 'Bar paradiso', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '41', name: 'Confine', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['pizza', 'expensive'], comments: 'pizza cara a Milano ma 2a migliore', rating: 5, dateAdded: new Date().toISOString() },
  { id: '42', name: 'Al baretto San Marco', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '43', name: 'Veramente', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['visited'], comments: 'stata, carino il luogo ma cibo niente di che', rating: 3, dateAdded: new Date().toISOString() },
  { id: '44', name: 'Drogheria Milanese', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '45', name: 'Il mosto selvatico', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '46', name: 'Ricchia', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '47', name: 'ShooLongKan', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['hotpot'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '48', name: 'Mao Hunan', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['chinese', 'visited'], comments: 'stata', rating: 4, dateAdded: new Date().toISOString() },
  { id: '49', name: 'Emoraya', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['eel'], comments: 'wow anguilla', rating: 5, dateAdded: new Date().toISOString() },
  { id: '50', name: 'Cucina franca', city: 'Milano', category: 'dinner', cuisine: 'french', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '51', name: 'Beluga', city: 'Milano', category: 'dinner', cuisine: 'other', zone: '', tags: ['russian', 'top'], comments: 'URSS > top', rating: 5, dateAdded: new Date().toISOString() },
  { id: '52', name: 'Noodle house', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['korean'], comments: 'coreano', rating: 4, dateAdded: new Date().toISOString() },
  { id: '53', name: 'Ultramarino', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['wine bar', 'reservation needed'], comments: 'winehouse da prenotare', rating: 4, dateAdded: new Date().toISOString() },
  { id: '54', name: 'Città del drago', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['chinese', 'cheap'], comments: 'cinese cheap', rating: 3, dateAdded: new Date().toISOString() },
  { id: '55', name: 'Il gusto della nebbia', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['chinese', 'to try'], comments: 'cinese da provare', rating: 0, dateAdded: new Date().toISOString() },
  { id: '56', name: 'Maoji', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['chinese', 'must try'], comments: 'cinese DA PROVARE!', rating: 0, dateAdded: new Date().toISOString() },
  { id: '57', name: 'Mater', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['family'], comments: 'portare i miei genitori qua', rating: 4, dateAdded: new Date().toISOString() },
  { id: '58', name: 'Immorale', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '59', name: 'Sugo', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '60', name: 'Gastronomia yamamoto', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['japanese'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '61', name: 'Veranda', city: 'Milano', category: 'dinner', cuisine: 'other', zone: '', tags: ['russian', 'ukrainian', 'georgian'], comments: 'russia-ucraina-georgiana', rating: 4, dateAdded: new Date().toISOString() },
  { id: '62', name: 'Kusinela', city: 'Milano', category: 'dinner', cuisine: 'other', zone: '', tags: ['filipino'], comments: 'filippino', rating: 4, dateAdded: new Date().toISOString() },
  { id: '63', name: 'Bussarakham', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['thai'], comments: 'thailandese', rating: 4, dateAdded: new Date().toISOString() },
  { id: '64', name: 'Shoo long khan', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['hotpot'], comments: 'hotpot', rating: 4, dateAdded: new Date().toISOString() },
  { id: '65', name: 'Mic ramen', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['ramen'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '66', name: 'Remulass', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '67', name: 'Una cosa di ofele', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['bistro'], comments: 'bistro', rating: 4, dateAdded: new Date().toISOString() },
  { id: '68', name: 'Oshin', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['japanese'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '69', name: 'Dal Re', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['milanese'], comments: 'milanese', rating: 4, dateAdded: new Date().toISOString() },
  { id: '70', name: 'Da berti', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['garden'], comments: 'giardino', rating: 4, dateAdded: new Date().toISOString() },
  { id: '71', name: 'Miro osteria del cinema', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['garden'], comments: 'giardino', rating: 4, dateAdded: new Date().toISOString() },
  { id: '72', name: 'Sette cucina urbana', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['garden'], comments: 'giardino', rating: 4, dateAdded: new Date().toISOString() },
  { id: '73', name: 'Trattoria Sinceramente', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '74', name: 'Ciciarà', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '75', name: 'Røst', city: 'Milano', category: 'dinner', cuisine: 'other', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '76', name: 'Tipografia alimentare', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '77', name: 'Ughetto', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '78', name: 'Locanda del menarost', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '79', name: 'Luiji', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['chinese', 'northern'], comments: 'nord della cina', rating: 4, dateAdded: new Date().toISOString() },
  { id: '80', name: 'Okuzashi Shikimenya', city: 'Milano', category: 'dinner', cuisine: 'asian', zone: '', tags: ['japanese'], comments: '', rating: 4, dateAdded: new Date().toISOString() },

  // Aperitivo
  { id: '81', name: 'Minerale', city: 'Milano', category: 'aperitivo', cuisine: '', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '82', name: 'Silvano', city: 'Milano', category: 'aperitivo', cuisine: '', zone: 'Piazza Morbegno', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '83', name: 'Ugo', city: 'Milano', category: 'aperitivo', cuisine: '', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '84', name: 'Vinello', city: 'Milano', category: 'aperitivo', cuisine: '', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '85', name: 'Enoteca Naturale', city: 'Milano', category: 'aperitivo', cuisine: '', zone: '', tags: ['wine'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '86', name: 'Deposito Enoteca', city: 'Milano', category: 'aperitivo', cuisine: '', zone: '', tags: ['wine', 'date spot', 'after dinner'], comments: 'anche dopocena, per date', rating: 4, dateAdded: new Date().toISOString() },
  { id: '87', name: 'SunEleven terrazza', city: 'Milano', category: 'aperitivo', cuisine: '', zone: '', tags: ['terrace'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '88', name: 'Terrazza vertigo', city: 'Milano', category: 'aperitivo', cuisine: '', zone: '', tags: ['terrace'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '89', name: 'Chiosco mentana', city: 'Milano', category: 'aperitivo', cuisine: '', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '90', name: 'Coke tales', city: 'Milano', category: 'aperitivo', cuisine: '', zone: '', tags: ['date spot'], comments: 'date', rating: 4, dateAdded: new Date().toISOString() },

  // Bar
  { id: '91', name: 'Via stampa', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '92', name: 'Bar Quadranno', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '93', name: 'Caffe montalcino', city: 'Milano', category: 'bar', cuisine: 'french', zone: '', tags: ['pastry', 'lunch'], comments: 'anche pranzo ma pasticceria francese', rating: 4, dateAdded: new Date().toISOString() },
  { id: '94', name: 'Frero Bar', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },

  // Colazione/Merenda
  { id: '95', name: 'Zaini', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['breakfast', 'pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '96', name: 'Ziva Pasticceria', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry', 'visited'], comments: 'stata, ok', rating: 3, dateAdded: new Date().toISOString() },
  { id: '97', name: 'Alessandro Servida', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '98', name: 'The coffee viale piave', city: 'Milano', category: 'bar', cuisine: '', zone: 'Viale Piave', tags: ['coffee'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '99', name: 'Ile douce', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '100', name: 'Le polveri', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '101', name: 'Nowhere', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['coffee'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '102', name: 'Sisu', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '103', name: 'Pasticceria Clea', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '104', name: 'Chicco d\'autore', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['coffee'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '105', name: 'Felicetta', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '106', name: 'Ciacco Lab', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '107', name: 'Dosa', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['vegan'], comments: 'veg', rating: 4, dateAdded: new Date().toISOString() },
  { id: '108', name: 'Fabio del Duca', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '109', name: 'Chicchi d\'Autore', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['coffee'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '110', name: 'Onest', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['coffee'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '111', name: 'Oro Nero', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['coffee'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '112', name: 'Andrea Aprea', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastry'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '113', name: 'Dashi', city: 'Milano', category: 'bar', cuisine: 'asian', zone: '', tags: ['chinese pastry'], comments: 'pasticceria cinese per merenda', rating: 4, dateAdded: new Date().toISOString() },
  { id: '114', name: 'Nata a Milano', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['pastel de nata'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '115', name: 'PAN milano', city: 'Milano', category: 'bar', cuisine: '', zone: '', tags: ['bakery'], comments: '', rating: 4, dateAdded: new Date().toISOString() },

  // Serate
  { id: '116', name: 'Madison', city: 'Milano', category: 'club', cuisine: '', zone: '', tags: [], comments: '', rating: 4, dateAdded: new Date().toISOString() },

  // Pranzo
  { id: '117', name: 'El tombon', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['lunch'], comments: '', rating: 4, dateAdded: new Date().toISOString() },
  { id: '118', name: 'Stadera', city: 'Milano', category: 'dinner', cuisine: 'italian', zone: '', tags: ['lunch'], comments: '', rating: 4, dateAdded: new Date().toISOString() }
];

const Index = () => {
  const [spots, setSpots] = useState<NightlifeSpot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<NightlifeSpot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    cuisine: '',
    zone: '',
    rating: 0
  });

  // Load spots from localStorage on component mount, with initial data fallback
  useEffect(() => {
    const savedSpots = localStorage.getItem('nightlife-spots');
    if (savedSpots) {
      const parsedSpots = JSON.parse(savedSpots);
      setSpots(parsedSpots);
      setFilteredSpots(parsedSpots);
    } else {
      // If no saved spots, use initial data
      setSpots(initialSpots);
      setFilteredSpots(initialSpots);
      localStorage.setItem('nightlife-spots', JSON.stringify(initialSpots));
    }
  }, []);

  // Save spots to localStorage whenever spots change
  useEffect(() => {
    localStorage.setItem('nightlife-spots', JSON.stringify(spots));
  }, [spots]);

  useEffect(() => {
    let filtered = [...spots];

    if (searchQuery) {
      filtered = filtered.filter(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        spot.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilters.category) {
      filtered = filtered.filter(spot => spot.category === activeFilters.category);
    }
    if (activeFilters.cuisine) {
      filtered = filtered.filter(spot => spot.cuisine === activeFilters.cuisine);
    }
    if (activeFilters.zone) {
      filtered = filtered.filter(spot => spot.zone.toLowerCase().includes(activeFilters.zone.toLowerCase()));
    }
    if (activeFilters.rating > 0) {
      filtered = filtered.filter(spot => spot.rating >= activeFilters.rating);
    }

    filtered.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name);
    });

    setFilteredSpots(filtered);
  }, [spots, searchQuery, activeFilters]);

  const addSpot = (newSpot: Omit<NightlifeSpot, 'id' | 'dateAdded'>) => {
    const spot: NightlifeSpot = {
      ...newSpot,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    };
    setSpots(prev => [...prev, spot]);
  };

  const bulkImportSpots = (newSpots: Omit<NightlifeSpot, 'id' | 'dateAdded'>[]) => {
    const spotsWithIds = newSpots.map((spot, index) => ({
      ...spot,
      id: (Date.now() + index).toString(),
      dateAdded: new Date().toISOString()
    }));
    setSpots(prev => [...prev, ...spotsWithIds]);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      dinner: 'bg-orange-500',
      cocktail: 'bg-purple-500',
      bar: 'bg-blue-500',
      aperitivo: 'bg-pink-500',
      club: 'bg-red-500',
      other: 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const clearFilters = () => {
    setActiveFilters({
      category: '',
      cuisine: '',
      zone: '',
      rating: 0
    });
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(activeFilters).filter(value => 
    value !== '' && value !== 0
  ).length + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">NightSpots</h1>
              <p className="text-purple-200 text-sm">Your nightlife companion</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsBulkImportModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full h-12 w-12 p-0"
                title="Bulk Import"
              >
                <Upload className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full h-12 w-12 p-0"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search spots, tags, or neighborhoods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-purple-200">
            {filteredSpots.length} {filteredSpots.length === 1 ? 'spot' : 'spots'} 
            {searchQuery || activeFiltersCount > 0 ? ` found` : ` saved`}
          </p>
        </div>

        {filteredSpots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌃</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {spots.length === 0 ? "No spots saved yet" : "No spots match your search"}
            </h3>
            <p className="text-purple-200 mb-6">
              {spots.length === 0 
                ? "Start building your nightlife collection!" 
                : "Try adjusting your search or filters"
              }
            </p>
            {spots.length === 0 && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Spot
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSpots.map((spot) => (
              <Card key={spot.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-200 hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">{spot.name}</CardTitle>
                      <div className="flex items-center gap-2 text-purple-200 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{spot.zone}{spot.zone && ', '}{spot.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(spot.rating)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Badge className={`${getCategoryColor(spot.category)} text-white border-0`}>
                        {spot.category}
                      </Badge>
                      {spot.cuisine && (
                        <Badge variant="outline" className="border-white/30 text-purple-200">
                          {spot.cuisine}
                        </Badge>
                      )}
                    </div>

                    {spot.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {spot.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-white/20 text-white text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {spot.tags.length > 3 && (
                          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                            +{spot.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {spot.comments && (
                      <p className="text-purple-100 text-sm italic line-clamp-2">
                        "{spot.comments}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AddSpotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addSpot}
      />
      
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={activeFilters}
        onFiltersChange={setActiveFilters}
      />

      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImport={bulkImportSpots}
      />
    </div>
  );
};

export default Index;
