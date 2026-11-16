import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function App(){
  const [ clima, setClima ] = useState(null);
  const [ carregando, setCarregando ] = useState(false);
  const [ erro, setErro ] = useState(null);

  // assíncrona para não travar a requisição
  async function buscarClima() {
    try{

      setCarregando(true);
      setErro(null);
      
      // ↓ busca os dados json da api
      const resposta = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.2642&longitude=-47.2992&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo');
      
      if (!resposta.ok){
        throw new Error('Erro ao consultar a API');
      }
      
      const dados = await resposta.json();
      console.log(dados);
      
      setClima(dados.current);

    } catch (error) {

      setErro('Não foi possível obter os dados.');

    } finally {

      setCarregando(false);

    }
  }

  return(
    <View style={styles.container}>

      <Text style={styles.titulo}>
        ClimaApp
      </Text>

      <Text style={styles.cidade}>
        Itu - SP
      </Text>

      // ↓ se clima tiver setado, então execute o método nos parênteses
      {clima && (
        <>
          <Text style={styles.temperatura}>
            {clima.temperature_2m}°C
          </Text>

          <Text style={styles.medium}>
            {clima.apparent_temperature}°C
          </Text>

          <Text style={styles.medium}>
            {clima.relative_humidity_2m}%
          </Text>

          <Text style={styles.medium}>
            {clima.wind_speed_10m}km/h
          </Text>
        </>
      )}
      <Text style={styles.descricao}>
       ↓ Consulte o clima da cidade ↓
      </Text>

      <Button
        title='Atualizar clima'
        onPress={buscarClima}
        disabled={carregando}
        color={'#ff82b4'}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffbcd7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  cidade: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30
  },
  temperatura: {
    color: '#fff',
    fontSize: 70,
    fontWeight: 'bold',
    marginTop: 20
  },
  medium: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 20
  },
  descricao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },
  erro: {
    color: '#ff8585',
    fontSize: 16,
    marginTop: 20
  }
})