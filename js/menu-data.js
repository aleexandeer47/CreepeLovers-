// Menú Crêpe Lovers — transcrito del menú oficial Galerías y Zona Rosa
// (crepelovers.cyanstudio.com/galeyzrosa.html). Precios en USD, incluyen IVA.
//
// Formato de cada producto:
//   n: nombre · d: descripción · p: precio · v: variantes [[etiqueta, precio], ...] · info: nota pequeña

const FRIENDLY = 'Hazla sugar, dairy y gluten friendly +$1.50';

export const BRANCH_NOTE = 'Precios del menú de Galerías y Zona Rosa. Pueden variar por sucursal.';

// Destacados del carrusel horizontal
export const FEATURED = [
  { cat: 'Crêpe dulce', name: 'Crêpe Nutella', price: '$5.50', desc: 'El clásico. Agrega banano +$0.75 o banano y fresa +$0.99.', img: 'assets/menu/crepe-nutella-banano.jpg', bg: '#f4edfc' },
  { cat: 'Crêpe salada', name: 'Margherita', price: '$6.50', desc: 'Mozzarella, tomate fresco, albahaca, pesto y salsa pomodoro. Con ensalada de la casa.', img: 'assets/menu/crepe-margherita.jpg', bg: '#dfe8f8' },
  { cat: 'Sandwich', name: 'Croque Monsieur', price: '$9.99', desc: 'Pan brioche, jamón de pavo, pollo asado, bechamel, champiñones y queso gratinado.', img: 'assets/menu/croque-monsieur.jpg', bg: '#ffe3ea' },
  { cat: 'Sandwich', name: 'Don Pepito', price: 'desde $8.99', desc: 'Mayonesa de chimichurri, queso fundido, cebolla caramelizada y guacamole. Pollo o lomito.', img: 'assets/menu/don-pepito.jpg', bg: '#fbe9d6' },
  { cat: 'Pizza crêpe', name: 'Pizza Margherita', price: '$9.99', desc: 'Nuestra única masa crêpe con pomodoro, queso, tomate y albahaca fresca.', img: 'assets/menu/pizza-margherita.jpg', bg: '#fde7dc' },
  { cat: 'Salad', name: 'Strawberry Citrus Park', price: 'desde $9.99', desc: 'Mézclum, espinaca, fresas, aguacate, crocante de semillas y maple, queso feta.', img: 'assets/menu/strawberry-citrus-park.jpg', bg: '#dcefe2' },
  { cat: 'Postre', name: 'Cheesecake de Fresa', price: '$5.99', desc: 'Cheesecake de la casa con crust de galleta de mantequilla y chantilly.', img: 'assets/menu/cheesecake-fresa.jpg', bg: '#ffe3ea' },
  { cat: 'Postre', name: 'Flan de Queso', price: '$4.99', desc: 'Flan de la casa, cremoso y con caramelo.', img: 'assets/menu/flan-de-queso.jpg', bg: '#fff1e0' },
  { cat: 'Frappé', name: 'Frappé Biscoff', price: '$4.60', desc: 'También en pistacho, Oreo, mocca o caramel latte.', img: 'assets/menu/frappe-biscoff.jpg', bg: '#e8dbf8' },
];

// Carta completa, agrupada en pestañas
export const CARTA = [
  {
    id: 'salado', label: 'Salado', img: 'assets/menu/crepe-margherita.jpg',
    sections: [
      {
        title: 'Entradas',
        items: [
          { n: 'Sopa de Tortilla', p: '$5.99', d: 'Fondo de tortilla con tomates asados, queso fundido, queso blanco, crema, aguacate, chips de maíz y pollo.' },
          { n: 'Fondue Au Gratin', p: '$8.50', d: 'Fundido de queso gratinado, acompañado de crêpe chips, crostinis y salsa pomodoro.', v: [['+ Champiñones al ajillo', '$1.00'], ['+ Tocino', '$1.00']] },
          { n: 'Frites & Cheese', p: '$8.50', d: 'Papas fritas condimentadas, parmesano, cheddar fundido, cebollín y pepinillos.' },
          { n: 'Nacho Lovers', p: '$9.00', d: 'Nachos de maíz, pollo, frijoles, pico de gallo, queso fundido, guacamole, aderezo chipotle y nuestra salsa azteca.', v: [['Con res', '$9.99']] },
        ],
      },
      {
        title: 'Crêpes saladas',
        note: 'Acompañadas de ensalada de la casa o ensalada y papas baby sazonadas. Salsa a elección: pomodoro o blanca. Agrega guacamole +$1.00. ' + FRIENDLY + '.',
        items: [
          { n: 'Mozzarella champiñones o jamón', p: '$5.99', d: 'Queso mozzarella, champiñones marinados o jamón y especias de la casa, con salsa a elección.' },
          { n: 'Pizza Crêpe', p: '$5.99', d: 'Mozzarella, salsa pomodoro y a elección: pepperoni, jamón o champiñones.' },
          { n: 'Margherita', p: '$6.50', d: 'Queso mozzarella, tomate fresco, albahaca, pesto, salsa pomodoro y especias de la casa.' },
          { n: 'Cordon Bleu', p: '$6.99', d: 'Con pollo, jamón, mozzarella y salsa bechamel.' },
          { n: 'Jalapeño Lovers', p: '$6.99', d: 'Mozzarella, roast beef, nuestra crema de cebolla con jalapeño, salsa blanca y especias.' },
          { n: 'Le California', p: '$7.99', d: 'Jamón de pavo, mozzarella, aguacate, bacon bites, pesto, albahaca fresca y especias.' },
          { n: 'Chicken Carbonara', p: '$8.50', d: 'Mozzarella, pollo, bacon bites, parmesano y salsa bechamel.' },
          { n: 'Chicken Florentine', p: '$8.50', d: 'Mozzarella, pollo, parmesano, champiñones salteados, espinaca y salsa a elección.' },
          { n: 'Crêpe Mignon', p: '$8.50', d: 'Nuestro roast beef, champiñones salteados, salsa bechamel de la casa, mozzarella y especias.' },
        ],
      },
      {
        title: 'Crêpe Au Gratin',
        note: 'Acompañadas de ensalada de la casa. ' + FRIENDLY + '.',
        items: [
          { n: 'Crêpe Rotolini Ricotta', p: '$8.50', d: 'Rollos de crêpe rellenos de espinaca, cebolla y ricotta, bañados y gratinados con nuestra salsa bechamel y parmesano.' },
          { n: 'Crêpe Four Cheese Lasagna', p: '$8.50', d: 'Lasagna de crêpe gratinada rellena de nuestra mezcla de 4 quesos, bañada con salsa bechamel o pomodoro.' },
          { n: 'Bolognese Lasagna', p: '$9.99', d: 'Lasagna de crêpe gratinada, ragout de res de la casa, salsa pomodoro, salsa bechamel, pesto y parmesano.' },
        ],
      },
      {
        title: 'Bowls & Salads',
        items: [
          { n: 'Strawberry Citrus Park', d: 'Mézclum de lechuga, espinacas, fresas frescas, aguacate, crocante multisemillas y maple, queso feta. Aderezo César o vinagreta balsámica.', v: [['Pollo', '$9.99'], ['Camarón', '$14.50']] },
          { n: 'Azteca Cobb', d: 'Mézclum de lechuga, tocino, pico de gallo, aguacate, maíz dulce, cebolla morada, queso feta y mix de quesos, aderezado con cilantro limón.', v: [['Pollo', '$9.99'], ['Lomito', '$11.99']] },
          { n: 'Country Salad', p: '$9.99', d: 'Mézclum de lechuga, pollo a la plancha, maíz dulce, queso cheddar, huevo duro, crutones, tomate, cebolla y aderezo ranch o buffalo-ranch.' },
          { n: 'César Salad', p: '$8.50', d: 'Lechuga romana, nuestro aderezo César, crutones al horno, parmesano, queso feta y tocino crujiente.', v: [['Con pollo', '$9.50']] },
          { n: 'Avo Shrimp Bowl', p: '$15.50', d: 'Mézclum de lechugas, camarones al ajillo, tomate cherry, maíz asado, feta y miel, tocino, cebollín, aguacate y huevo duro, con aceite oriental spicy.' },
        ],
      },
      {
        title: 'Sandwiches',
        note: 'Acompañamiento a elección (1): papas francesas, ensalada o sopa de tortilla.',
        items: [
          { n: 'Don Pepito', d: 'Mayonesa de chimichurri, queso fundido, cebollas caramelizadas, guacamole de la casa y frijoles volteados, con pico de gallo o aderezo chipotle.', v: [['Pollo', '$8.99'], ['Lomito', '$12.50']] },
          { n: 'Ranch Sandwich', d: 'Cheddar, aguacate, lechuga, tomate, cebolla morada y aderezo ranch.', v: [['Pollo', '$7.99'], ['Lomito', '$8.99']] },
          { n: 'Chicken BBQ', p: '$8.99', d: 'Pollo a la plancha, cheddar fundido, aguacate, cebolla caramelizada, salsa BBQ y bacon bites.' },
          { n: 'Croque Monsieur', p: '$9.99', d: 'Pan brioche con mantequilla, jamón de pavo, pollo asado, bañado con nuestra salsa bechamel, champiñones salteados, queso gratinado, parmesano y bacon bites.' },
          { n: 'Philly Steak', p: '$10.50', d: 'Lomito asado con pimientos, cebolla y champiñones, bañado con nuestra salsa de queso fundido.' },
        ],
      },
      {
        title: 'Pizza',
        note: 'Especialidad de la casa en nuestra única masa crêpe. Hazla sugar, dairy y gluten friendly +$1.99.',
        items: [
          { n: 'Margherita', p: '$9.99', d: 'Salsa pomodoro, queso, tomate, albahaca fresca y especias.' },
          { n: 'Pepperoni', p: '$9.99', d: 'Queso fundido, salsa pomodoro y pepperoni.' },
          { n: 'Hawaiana', p: '$10.25', d: 'Salsa blanca o pomodoro, queso fundido, piña asada, pimientos y cebolla salteados.', v: [['Con pollo', '+$2.00']] },
          { n: 'Bacon and BBQ Chicken', p: '$11.99', d: 'Salsa blanca o pomodoro, queso fundido, pollo BBQ, cebolla salteada, bacon bites y aderezo ranch.' },
          { n: 'Marinera', p: '$11.99', d: 'Queso fundido, champiñones salteados al ajillo, camarones, cebolla salteada y salsa blanca o pomodoro.' },
        ],
      },
    ],
  },
  {
    id: 'dulce', label: 'Dulce', img: 'assets/menu/crepe-cono.jpg',
    sections: [
      {
        title: 'Sweet crêpes',
        note: FRIENDLY + '.',
        items: [
          { n: 'Crêpe Dulce de Leche', p: '$4.35' },
          { n: 'Crêpe Biscoff', p: '$4.85' },
          { n: 'Crêpe Pistacho', p: '$5.50' },
          { n: 'Crêpe Nutella', p: '$5.50' },
        ],
        extras: { title: 'Agrega fruta', list: [['Banano', '+$0.75'], ['Melocotón', '+$0.85'], ['Fresa', '+$0.99'], ['Banano y fresa', '+$0.99'], ['Con brownie', '+$0.99']] },
      },
      {
        title: 'Crêpes de especialidades',
        note: FRIENDLY + '.',
        items: [
          { n: 'White Strawberry Melt', p: '$5.99', d: 'Chocolate blanco, mermelada de fresa y fresas naturales.' },
          { n: 'Cheesecake Lovers', p: '$5.99', d: 'Nutella, queso italiano y fresas.' },
          { n: 'Cheesecake Madness', p: '$5.99', d: 'Nutella, queso italiano, fresas y banano.' },
          { n: 'Happiness', p: '$5.99', d: 'Nutella, fresa y melocotón.' },
          { n: 'Oreo Treat', p: '$5.99', d: 'Nutella, marshmallows, galletas Oreo y crema chantilly.' },
          { n: 'Cookies ’n Cream', p: '$5.99', d: 'Chocolate blanco, Nutella y Oreo.' },
          { n: 'Cardenal', p: '$5.99', d: 'Dulce de leche, mermelada de fresa, espumilla, fresas y chantilly.' },
          { n: 'Pistacho o Biscoff Madness', p: '$6.99', d: 'Pistacho italiano o Biscoff, cheesecake, fresa o banano.' },
        ],
      },
      {
        title: 'Healthy crêpes',
        note: 'Endulzadas con alulosa: bajo en calorías, no afecta la glucosa en sangre ni la insulina. Apta para personas con diabetes.',
        items: [
          { n: 'Crêpe Gluten Friendly, Dairy & Sugar Free', p: '$7.99', d: 'Crêpe sin gluten con caramelo de alulosa.', v: [['Con banano', '$6.99'], ['Con fresas', '$8.25'], ['Con banano y fresa', '$8.25']] },
          { n: 'Crêpe Apple Caramel', p: '$7.99', d: 'Crêpe sin gluten con compota de manzana sugar free, caramelo de alulosa y crumble sugar free.' },
        ],
      },
      {
        title: 'Toppings',
        items: [
          { n: 'Toppings clásicos', p: '$1.00', d: 'Mermelada de fresa, marshmallows o galletas Oreo.' },
          { n: 'Toppings especiales', p: '$1.99', d: 'Nutella, dulce de leche, crema de pistacho, crema de Biscoff, crema cheesecake, bola de helado de vainilla, chantilly, espumillas, nueces o almendras.' },
        ],
      },
      {
        title: 'Postres',
        items: [
          { n: 'Alfajores con Helado', p: '$3.99', d: 'Alfajores con dulce de leche, helado de vainilla, caramelo y azúcar glass.' },
          { n: 'Cup Fresita y Pistacho o Biscoff', p: '$4.00', d: 'Fresas, salsa de pistacho italiano o Biscoff, Nutella y chantilly.' },
          { n: 'Caja de Alfajores', p: '$4.99', d: '5 unidades.' },
          { n: 'Brownie', p: '$4.99', d: 'Brownie con dulce de leche o syrup de chocolate.', v: [['À la mode (con helado)', '$5.99']] },
          { n: 'Flan de Queso', p: '$4.99', d: 'Flan de la casa cremoso y caramelo.' },
          { n: 'Chocopecana Pie', p: '$5.99', d: 'Pie crujiente con abundante pecana y caramelo.' },
          { n: 'Cheesecake de Fresa', p: '$5.99', d: 'Cheesecake de la casa tradicional con crust de galleta de mantequilla, decorado con crema chantilly.' },
          { n: 'Pastel de Zanahoria', p: '$5.99', d: 'Doble torta de zanahoria fresca con toques de vainilla, cocoa y pecanas, recubierta de crema de queso y chocolate blanco.' },
        ],
      },
      {
        title: 'Healthy desserts',
        items: [
          { n: 'Carrot Cake', p: '$3.50', d: 'Sin gluten y sin azúcar: zanahoria fresca, canela, nuez moscada y nueces pecanas, coronado con glaseado de queso.', info: 'Contiene harina de almendras, huevos, monk fruit, lácteos y nuez pecana.' },
          { n: 'Banana Bread', p: '$3.99', d: 'Cake sin gluten ni azúcar, endulzado naturalmente con banano y nueces. Con caramelo sin azúcar.', info: 'Contiene fruta, harina de almendra, huevo, almendra, nuez y lácteos.' },
        ],
      },
    ],
  },
  {
    id: 'bebidas', label: 'Bebidas', img: 'assets/menu/frappe-biscoff.jpg',
    sections: [
      {
        title: 'Bebidas calientes',
        note: 'Leche a elección: entera, descremada o deslactosada. Cámbiala por leche de almendra, soya o coco +$0.75.',
        items: [
          { n: 'Café Espresso', p: '$2.50' },
          { n: 'Café Americano', v: [['8 oz', '$2.25'], ['12 oz', '$2.75'], ['16 oz', '$3.25']] },
          { n: 'Capuccino', v: [['8 oz', '$3.50'], ['12 oz', '$3.75'], ['16 oz', '$4.00']] },
          { n: 'Latte', v: [['8 oz', '$3.25'], ['12 oz', '$3.50'], ['16 oz', '$3.75']] },
          { n: 'Chai Latte', v: [['8 oz', '$4.00'], ['12 oz', '$4.25'], ['16 oz', '$4.50']] },
          { n: 'Bombón Latte', p: '$2.50', d: 'Con leche condensada.' },
          { n: 'Infusiones y Té', p: '$3.00' },
          { n: 'Matcha Latte Ceremonial', p: '$4.55' },
        ],
      },
      {
        title: 'Bebidas frías',
        items: [
          { n: 'Agua en botella', p: '$1.25' },
          { n: 'Sodas', p: '$2.40' },
          { n: 'Salutaris', p: '$2.40', d: 'Limón, naranja o toronja.' },
          { n: 'Naranjada', p: '$2.80' },
          { n: 'Horchata', p: '$2.80', d: 'Con agua o con leche.' },
          { n: 'Limonada', p: '$2.99', d: 'Natural, albahaca, hierbabuena, pink, fresa o maracuyá.', v: [['Con soda', '$3.25']] },
          { n: 'Matcha Latte Iced', p: '$4.75' },
          { n: 'Matcha Latte Frozen', p: '$4.75' },
        ],
      },
      {
        title: 'Frappés',
        items: [
          { n: 'Pistacho · Biscoff · Oreo · Mocca · Caramel latte', p: '$4.60', d: 'Precio por frappé.' },
        ],
      },
      {
        title: 'Iced coffee latte',
        items: [
          { n: 'Iced coffee latte', p: '$3.99' },
          { n: 'Caramel iced coffee latte', p: '$4.99' },
          { n: 'Moka iced coffee latte', p: '$4.99' },
          { n: 'Chai latte iced coffee', p: '$4.99' },
        ],
      },
      {
        title: 'Slushies tapioca',
        note: 'Nutritiva combinación de tapioca, yogurt, té verde y frutas naturales. $4.55 c/u · sin tapioca $4.50.',
        items: [
          { n: 'Berry Deli', p: '$4.55', d: 'Frutos del bosque y yogurt.' },
          { n: 'Skinny Strawberry', p: '$4.55', d: 'Fresas y banano.' },
          { n: 'Peach Pleasure', p: '$4.55', d: 'Durazno, coco y piña.' },
          { n: 'Cherry Dream', p: '$4.55', d: 'Cerezas rojas y yogurt.' },
          { n: 'Taro', p: '$5.00' },
        ],
      },
      {
        title: 'Frozen',
        items: [
          { n: 'Clásicos', p: '$4.00', d: 'Coco, sandía, fresa o piña colada.' },
          { n: 'Nirvana', p: '$4.55', d: 'Limonada y coco.' },
          { n: 'Ying Yang', p: '$4.55', d: 'Limonada, piña y albahaca.' },
          { n: 'Mangolicious', p: '$4.55', d: 'Coco, mango, banana y fresas.' },
          { n: 'Red Karma', p: '$4.55', d: 'Naranja, piña, fresa y cilantro.' },
        ],
      },
    ],
  },
  { id: 'promos', label: 'Promos', img: 'assets/menu/don-pepito.jpg', promos: true },
];

export const COMBIFICA = {
  when: 'Lunes a viernes · 11:00 am – 3:00 pm',
  price: '$7.99',
  includes: '1 plato + 1 complemento + 1 bebida',
  plates: [
    ['Crêpe salada', '$7.99', 'Crêpe Margherita, Pizza Crêpe Pepperoni o Pizza Crêpe Jamón.'],
    ['Sandwich', '$9.99', 'Ranch Sandwich de pollo o Chicken BBQ.'],
    ['Salads (media ensalada)', '$9.99', 'Country Salad, Azteca Bowl de pollo o César Salad con pollo.'],
  ],
  side: 'Ensalada César Jr, sopa de tortilla Jr o papas fritas.',
  drink: 'Limonada, té helado o soda.',
  fine: 'Restricciones aplican.',
};

export const DAILY = {
  price: '$3.99',
  days: [
    ['Lunes', 'Pizza Crêpe', 'Nutella Banano'],
    ['Martes', 'Cordon Bleu', 'Cookies & Cream'],
    ['Miércoles', 'Chicken Florentine', 'Dulce de Leche Banano y Fresa'],
    ['Jueves', 'Margherita', 'Biscoff Fresa'],
    ['Viernes', 'Chicken Parmesan', 'Pistacho Fresa'],
  ],
  match: 'Agrega el match perfecto +$1.99: limonada tradicional 12 oz, soda, café americano o iced coffee 12 oz (tradicional, caramelo o moka).',
  fine: 'Restricciones aplican. No incluye acompañamientos.',
};

export const FINE_PRINT = [
  'Nuestros precios incluyen IVA y no incluyen propina. Se cobrará un recargo de propina del 10% sobre consumo sin descuento en servicio en restaurante.',
  'Nuestros platos podrían contener nueces y productos alergénicos y/o gluten. Si tienes alguna alergia, avísale a tu mesero o al gerente.',
  'Usamos 100% aceite vegetal. Las porciones reflejan peso precocinado y los pesos de proteínas son en crudo. Imágenes de referencia.',
];
