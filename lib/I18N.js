"use strict";

import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
      title: 'BabyHelper',
      note_list_title: 'Notes',
      dateFormat: {
            dayNames: [
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ],
            monthNames: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            ],
            timeNames: [
                'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
            ]
        },
    },
    es: {
      title: 'BabyHelper',
      note_list_title: 'Notas',
      dateFormat: {
          dayNames: [
              'Dom', 'Lun', 'Mar', 'Mier', 'Juev', 'Vier', 'Sab',
              'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'
          ],
          monthNames: [
              'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ag', 'Sep', 'Oct', 'Nov', 'Dic',
              'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ],
          timeNames: [
              'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
          ]
      }
   }
}


export default I18n;
