import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';

export default function App(){
  const [ clima, setClima ] = useState(null);
  const [ carregando, setCarregando ] = useState(false);
  const [ erro, setErro ] = useState(null);

  function descreverClima(codigo){
    if(codigo === 0) return 'Céu limpo';

    if([45, 48].includes(codigo)) {
      return 'Neblina';
    };

    if([1, 2].includes(codigo)) {
      return 'Parcialmente nublado';
    };

    if(codigo === 3) return 'Nublado';

    if([51, 53, 61, 63, 65, 80, 81, 82].includes(codigo)) {
      return 'Chuva';
    };

    if([95, 96, 99].includes(codigo)) {
      return 'Tempestade';
    };

    return 'Condição variável';
  }

  // assíncrona para não travar a requisição
  async function buscarClima() {
    try{

      setCarregando(true);
      setErro(null);
      
      // ↓ busca os dados json da api
      const resposta = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.6848&longitude=-120.0656&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo');
      
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

    useEffect(() => {
      buscarClima
    }, []);
  }

  return(
    <View style={styles.container}>

      <Text style={styles.titulo}>
        ClimaApp
      </Text>

      <Text style={styles.cidade}>
        Itu - SP
      </Text>

      {carregando && (
        <ActivityIndicator
          size='large'
          color='#fff'
          style={styles.loading}
        />
      )}

      {erro && (
        <Text style={styles.erro}>
          {erro}
        </Text>
      )}

      // ↓ se clima tiver setado, então execute o método nos parênteses
      {clima && (
        <>
          <Text style={styles.subtitulo}>Temperautura</Text>
          <Text style={styles.temperatura}>
            {Math.round(clima.temperature_2m)}°C
          </Text>

          <Text style={styles.cidade}>
            {descreverClima(clima.weather_code)}
          </Text>

          <View style={styles.infomacao}>
            <Text style={styles.subtitulo}>Sensação Térmica</Text>
            <Text style={styles.medium}>
              {Math.round(clima.apparent_temperature)}°C
            </Text>

            <Text style={styles.subtitulo}>Umidade relativa do ar</Text>
            <Text style={styles.medium}>
              {Math.round(clima.relative_humidity_2m)}%
            </Text>

            <Text style={styles.subtitulo}>Velocidade do ar</Text>
            <Text style={styles.medium}>
              {Math.round(clima.wind_speed_10m)}km/h
            </Text>
          </View>
        </>
      )}
      <Text style={styles.descricao}>
      ↓ Consulte o clima da cidade ↓
      </Text>
      <View style={styles.botao}>
        <Button
          title='Atualizar clima'
          onPress={buscarClima}
          disabled={carregando}
          color={'#ff82b4'}
        />
      </View>
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
  infomacao: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
    backgroundColor: '#ee669d',
    color: '#ffbcd7',
    fontSize: 30,
    fontWeight: 'bold'
  },
  subtitulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  cidade: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10
  },
  temperatura: {
    color: '#fff',
    fontSize: 70,
    fontWeight: 'bold',
    marginTop: 5
  },
  medium: {
    color: '#fff',
    fontSize: 40,
    marginTop: 5
  },
  descricao: {
    color: '#ee669d',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10
  },
  botao: {
    marginTop: 40,
    width: 200
  },
  erro: {
    color: '#ff8585',
    fontSize: 16,
    marginTop: 20
  }
})