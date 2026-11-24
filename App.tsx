import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, TextInput } from 'react-native';

export default function App(){
  const [ latitude, setLatitude ] = useState('');
  const lat = latitude.replace(',', '.');
  const [ longitude, setLongitude ] = useState('');
  const lon = longitude.replace(',', '.');

  const [ clima, setClima ] = useState(null);
  const [ cidade, setCidade ] = useState(null);

  const [ carregando, setCarregando ] = useState(false);
  const [ erro, setErro ] = useState(null);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo`
  const cidadeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`

  function descreverClima(codigo){
    if(codigo === 0) return 'Céu limpo';

    if([45, 48].includes(codigo)) {
      return '🌫️ Neblina';
    };

    if([1, 2].includes(codigo)) {
      return '🌤️ Parcialmente nublado';
    };

    if(codigo === 3) return '⛅ Nublado';

    if([51, 53, 61, 63, 65, 80, 81, 82].includes(codigo)) {
      return '🌧️ Chuva';
    };

    if([95, 96, 99].includes(codigo)) {
      return '⛈️ Tempestade';
    };

    return 'Condição variável';
  }

  // assíncrona para não travar a requisição
  async function buscarClima() {
    try{

      setCarregando(true);
      setErro(null);
      
      // ↓ busca os dados json da api
      const resposta = await fetch(url);
      const cidadeApi = await fetch(cidadeUrl, {
        headers: { 'User-Agent': 'ClimaApp-estudos'}
      });
      
      if (!resposta.ok || !cidadeApi.ok){
        throw new Error('Erro ao consultar a API');
      }

      const dados = await resposta.json();
      console.log(dados);
      const dadosCidade = await cidadeApi.json();
      console.log(dadosCidade);
      
      setClima(dados.current);
      setCidade(dadosCidade.address);

    } catch (error) {

      console.log(error);
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Latitude'
          placeholderTextColor='#969696'
          textAlign='center'
          value={latitude}
          onChangeText={setLatitude}
          keyboardType='numeric'
          cursorColor={'#ee669d'}
        />

        <TextInput
          style={styles.input}
          placeholder='Longitude'
          placeholderTextColor='#969696'
          textAlign='center'
          value={longitude}
          onChangeText={setLongitude}
          keyboardType='numeric'
          cursorColor={'#ee669d'}
        />
      </View>

      {carregando && (
        <ActivityIndicator
          size='large'
          color='#ffffff'
          style={styles.loading}
        />
      )}

      {erro && (
        <Text style={styles.erro}>
          {erro}
        </Text>
      )}

      {cidade && (
        <Text style={styles.city}>
          {(cidade.city || cidade.town || cidade.village || cidade.municipality)}
        </Text>
      )}

      {clima && (
        <>
          <Text style={styles.subtitulo}>Temperautura</Text>
          <Text style={styles.temperatura}>
            {Math.round(clima.temperature_2m)}°C
          </Text>

          <Text style={styles.descricao}>
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
    alignItems: 'center',
    paddingVertical: 20
  },
  infomacao: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
    color: '#ee669d',
    fontSize: 30,
    fontWeight: 'bold',

    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderColor: '#ee669d',
    borderRadius: 20,
  },
  subtitulo: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: 150,
    height: 46,
    fontSize: 17,
    borderWidth: 2,
    borderColor: '#ee669d',
    borderRadius: 8,

    color: '#ee669d',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    marginHorizontal: 10
  },
  city: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  temperatura: {
    color: '#ffffff',
    fontSize: 60,
    fontWeight: 'bold',
    marginTop: 5
  },
  medium: {
    color: '#ffffff',
    fontSize: 40,
    marginTop: 5
  },
  descricao: {
    color: '#ee669d',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ee669d'
  },
  botao: {
    marginTop: 30,
    width: 200
  },
  erro: {
    color: '#ff8585',
    fontSize: 16,
    marginTop: 15
  }
})