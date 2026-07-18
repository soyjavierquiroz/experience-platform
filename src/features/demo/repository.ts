export const demoExperience={
  profile:{name:"María",preferredName:"María",timezone:"Ciudad de México (UTC−6)",privacy:"Solo yo",activeExperience:"Mujer, No Le Escribas"},
  days:[
    [1,"Reconoce el ciclo","Observa el impulso con claridad.",true],[2,"Haz espacio","Crea distancia entre impulso y acción.",false],[3,"Escucha la necesidad","Nombra lo que realmente estás buscando.",false],[4,"Vuelve a los hechos","Separa esperanza de evidencia.",false],[5,"Sostén el límite","Protege la decisión que te devuelve calma.",false],[6,"Recupera tu energía","Dirige tu atención de vuelta hacia ti.",false],[7,"Elígete de nuevo","Cierra la semana con intención.",false],
  ] as const,
};
export type DemoDay=(typeof demoExperience.days)[number];
