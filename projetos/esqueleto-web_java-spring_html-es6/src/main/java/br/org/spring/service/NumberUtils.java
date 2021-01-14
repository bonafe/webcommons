package br.org.spring.service;

import java.util.Random;

public class NumberUtils {
	
	public static String completaZerosEsquerda(int numero, int casas) {
		return String.format("%0" + casas + "d", numero); 
	}
	
	public static int geraNumeroAleatorioPorIntervalo(int min, int max) {
		if (min >= max) {
			throw new IllegalArgumentException("max dever ser maior que min");
		}
		Random r = new Random();
		return r.nextInt((max - min) + 1) + min;
	}
}
