{"schemaVersion":"1.0","tenantSlug":"mnle","programSlug":"reto-7-dias","slug":"sos","title":"Estoy a punto de escribirle","status":"published","order":0,"contentVersion":"1.0.0","description":"Una pausa privada y siempre disponible.","estimatedMinutes":10,"alwaysAvailable":true,"unlockRule":{"type":"always"},"completionRule":{"type":"explicit"},"blocks":[
 {"id":"sos-pausa","type":"heading","version":1,"level":2,"text":"Haz una pausa antes de decidir"},
 {"id":"sos-aviso","type":"callout","version":1,"text":"Esta herramienta ofrece una pausa guiada y no sustituye apoyo profesional o de emergencia.","tone":"notice"},
 {"id":"sos-video-janny","type":"video","version":1,"title":"Antes de escribirle, vuelve a ti","assetRef":"mnle-module-0-video"},
 {"id":"sos-emocion-antes","type":"scale","version":1,"label":"¿Qué intensidad tiene la emoción ahora?","min":1,"max":10,"minLabel":"Baja","maxLabel":"Alta"},
 {"id":"sos-mensaje","type":"textarea","version":1,"label":"¿Qué quieres escribirle?","required":true,"private":true},
 {"id":"sos-expectativa","type":"textarea","version":1,"label":"¿Qué esperas recibir al enviarlo?","required":true,"private":true},
 {"id":"sos-necesidad","type":"singleChoice","version":1,"label":"¿Qué estás buscando?","options":[{"value":"claridad","label":"Claridad"},{"value":"atencion","label":"Atención"},{"value":"reconciliacion","label":"Reconciliación"},{"value":"respuesta","label":"Respuesta"},{"value":"alivio","label":"Alivio"},{"value":"otra","label":"Otra"}]},
 {"id":"sos-guardar","type":"action","version":1,"title":"Guardar sin enviar","description":"Tu mensaje queda en tu espacio privado.","confirmationLabel":"Guardado sin enviar"},
 {"id":"sos-temporizador","type":"timer","version":1,"title":"Regálate esta pausa","durationSeconds":600},
 {"id":"sos-audio","type":"audio","version":1,"title":"Audio de acompañamiento opcional","assetRef":"mnle-sos-audio"},
 {"id":"sos-ancla","type":"callout","version":1,"title":"Frase ancla","text":"No necesito resolverlo en este instante. Puedo volver a mí antes de elegir.","tone":"calm"},
 {"id":"sos-emocion-despues","type":"scale","version":1,"label":"¿Qué intensidad tiene la emoción después de la pausa?","min":1,"max":10},
 {"id":"sos-completar","type":"completion","version":1,"label":"Finalizar esta pausa"}
]}
