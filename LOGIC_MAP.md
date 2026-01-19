# Mapa de Lógica de Estados - CallPaste

Este documento define las reglas que determinan el estado visual y funcional de cada número en la lista.

## Estados del Número

| Estado | Color Visual | Comportamiento "Siguiente" | Condición |
| :--- | :--- | :--- | :--- |
| **Nuevo / Pendiente** | Normal (Blanco/Negro) | ✅ Se selecciona | Al crearse la lista (0 llamadas, 0 éxitos). |
| **Activo / Éxito** | 🟢 Borde Verde + Contador | ✅ Se selecciona (Prioridad) | Cuando tiene **1 o más conexiones exitosas** ("Repetir"). |
| **Fantasma 👻** | ⚪ Gris / Transparente | ❌ **Se SALTA automáticamente** | Cuando cumple las **Condiciones de Muerte**. |

---

## Condiciones de Transición (Reglas de Juego)

### 1. ¿Cómo volverse VERDE (Éxito)? 🟢
Un número se considera exitoso si:
*   El usuario presiona **"Repetir" (↺)**.
    *   *Significado:* La llamada conectó y se quiere insistir.
    *   *Efecto:* Aumenta `conteo_exitos (+1)`.

### 2. ¿Cómo volverse FANTASMA (Muerte)? 👻
Un número muere si ocurre **CUALQUIERA** de estas dos cosas:

#### A. Muerte Manual (Voto Negativo)
*   **Acción:** El usuario presiona **"Flecha Abajo" (▼)**.
*   **Causa:** El usuario detectó manualmente que el número no existe, buzón lleno, etc.
*   **Resultado:** Muerte inmediata.

#### B. Muerte Automática (Fatiga) ⚡ *NUEVO*
*   **Condición:** 
    *   Se ha llamado al número (`clicks_llamada`) **más de 10 veces**.
    *   **Y**... tiene **0 éxitos** (`conteo_exitos == 0`).
*   **Lógica:** "Si lo hemos intentado 10 veces y nunca ha servido, asumimos que no sirve".
*   **Resultado:** Se auto-clasifica como Fantasma.

---

## Resumen de Datos (Base de Datos)

Para lograr esto, cada número guardará ahora 3 datos:
1.  **`status`**: 'neutral', 'down' (manual).
2.  **`count`**: Número de éxitos (Repetir).
3.  **`attempts`**: Número de intentos de llamada (Clicks).

### Ejemplo Práctico

| Número | Intentos | Éxitos | Estado | ¿Por qué? |
| :--- | :---: | :---: | :--- | :--- |
| `+1234` | 0 | 0 | **Pendiente** | Nuevo. |
| `+5678` | 5 | 2 | **🟢 Verde** | Tiene éxitos. |
| `+9999` | 3 | 0 | **Pendiente** | Pocos intentos, aún hay esperanza. |
| `+6666` | **11** | **0** | **👻 Fantasma** | **Regla de Fatiga:** >10 intentos sin gloria. |
| `+0000` | 1 | 0 | **👻 Fantasma** | **Manual:** Alguien le dio "DownVote". |
