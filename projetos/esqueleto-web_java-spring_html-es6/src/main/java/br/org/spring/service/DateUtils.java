package br.org.spring.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


public class DateUtils {
	
	public static Date gerarData(String data) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
		try { 
			return sdf.parse(data);
		} catch (ParseException pe) { 
			return null;
		}
	}

	public static Date adicionarHoras(Date date, int hours) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.HOUR_OF_DAY, hours);
		return calendar.getTime();
	}
	
	public static Date adicionarMinutos(Date date, int minutos) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.MINUTE, minutos);
		return calendar.getTime();
	}

	public static int getMes(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.MONTH); 
	}

	public static int getAno(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.YEAR);  
	}
	
	public static int getDiaDoMes(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.DAY_OF_MONTH);  
	}
	
	public static int getDiaDoAno(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		return calendar.get(Calendar.DAY_OF_YEAR);  
	}
	
	public static int getHora(Date data) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(data);
		return calendar.get(Calendar.HOUR_OF_DAY);  
	}

	public static int getDiaDaSemana(Date data) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(data);
		return calendar.get(Calendar.DAY_OF_WEEK);
	}

	public static Date gerarData(int dia, int mes, int ano, int hora, int minuto) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
		try {
			Date data =  sdf.parse((dia < 10 ? "0" + dia : dia) + "/"  + 
					(mes < 10 ? "0" + mes : mes) + "/" +
					(ano) + " " +
					(hora < 10 ? "0" + hora : hora) + ":" +
					(minuto < 10 ? "0" + minuto : minuto));
			return data;
		} catch(ParseException pe) {
			return null;  
		}
	}
	
	public static Date setHorario(Date data, int hora, int min, int seg) {
		Calendar calendar = Calendar.getInstance();
        calendar.setTime(data);
        calendar.set(Calendar.HOUR_OF_DAY, hora);
        calendar.set(Calendar.MINUTE, min);
        calendar.set(Calendar.SECOND, seg);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
	}
	
	public static Date setHorario(Date data, String str) {		
		String [] h = str.split(":");
		return setHorario(data, Integer.parseInt(h[0]), 
				h.length > 1 ? Integer.parseInt(h[1]) : 0,  
						h.length > 2 ? Integer.parseInt(h[2]) : 0);
	}
	
	public static Date zerarHorario(Date data) {
		return setHorario(data, 0, 0, 0);
	}
	
	public static String getHorario(Date data) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(data);
		String ret = "";
		ret += NumberUtils.completaZerosEsquerda(calendar.get(Calendar.HOUR_OF_DAY), 2);
		ret += ":" + NumberUtils.completaZerosEsquerda(calendar.get(Calendar.MINUTE), 2);
		ret += ":" + NumberUtils.completaZerosEsquerda(calendar.get(Calendar.SECOND), 2);
		return ret;
	}
	
	public static boolean datasNoMesmoDia(Date data1, Date data2) {
		if (data1 == null || data2 == null)
			return false;
		Calendar cal1 = Calendar.getInstance();
		Calendar cal2 = Calendar.getInstance();
		cal1.setTime(data1);
		cal2.setTime(data2);
		return  cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR) &&
				cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR);
	}
	
	public static int numeroDeDiasDoMes(int mes, int ano) {
		YearMonth mesano = YearMonth.of(ano,mes);
		return mesano.lengthOfMonth();
	}
	
	public static boolean dataNoIntervalo(Date data, Date inicioIntervalo, Date fimIntervalo) {
		return data.equals(inicioIntervalo) || data.equals(fimIntervalo) ||
				(data.after(inicioIntervalo) && data.before(fimIntervalo));
	}
	
	public static Date primeiroDiaDoMes(int mes, int ano) {
		return gerarData(1, mes, ano, 0, 0);
	}
	
	public static Date ultimoDiaDoMes(int mes, int ano) {
		return gerarData(numeroDeDiasDoMes(mes, ano), mes, ano, 23, 59);
	}
	
	public static int diaDaSemana(Date data) {
		Calendar calendar = Calendar.getInstance();
        calendar.setTime(data);
        return calendar.get(Calendar.DAY_OF_WEEK);
	}
	
	public static int getAnoAtual() {
		return Calendar.getInstance().get(Calendar.YEAR);
	}
	
	public static List<Date> getDiasUteisMes(int mes, int ano) {
		List<Date> datas = new ArrayList<Date>();
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("dd/M/yyyy HH:mm");
			Date dia = sdf.parse("01"+"/"+mes+"/"+ano + " 00:00");
			while(getMes(dia) == mes-1) {
				int diaDaSemana = diaDaSemana(dia);
				if (diaDaSemana >= 2 && diaDaSemana <= 6) {
					datas.add(new Date(dia.getTime()));
				}
				dia = adicionarHoras(dia, 24);
			}
		} catch(ParseException pe) { }
		
		return datas;
	}
	
	public static String formatDDMMYYY(Date data) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		return sdf.format(data);
	}

	public static Float quantidadeDeHoras(Date data1, Date data2) {
		long diff = data2.getTime() - data1.getTime();
		long diffHours = diff / (60 * 60 * 1000);
		return (float)diffHours;
	}
}