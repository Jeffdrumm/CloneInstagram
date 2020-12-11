import React, { useState, useEffect, useCallback } from 'react';
import { Image,  Modal ,StyleSheet, FlatList, Button , View, Icon, ScrollView, TextInput, TouchableWithoutFeedback} from 'react-native';
import axios from 'axios'
import { AsyncStorage } from 'react-native';
import { Container,  TouchableOpacity, Post, Header, Avatar, Name, Description, Loading} from './styles';
import IconEnt from 'react-native-vector-icons/AntDesign'

export default function Feed() {
  const [error, setError] = useState('');
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewable, setViewable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [text, setText] = useState(''+'\n')
  const [idCurtida, setidCurtida] = useState('Curtidas:')
  const [idCurtidaComentario, setidCurtidaComentario] = useState(''+'\n')
  const [comentarios, setComentarios] = useState([])
  const [curtida, setCurtida] = useState ([])
  const [curtidacomentario, setCurtidaComentario] = useState ([])
  const [ListaCurtida, setListaCurtida] = useState(false);
  const [ListaComemtario, setListaComemtario] = useState(false);

  const MAX_LENGTH = 250;

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    if (pageNumber === total) return;
    if (loading) return;

    setLoading(true);   
    axios
    .get(`https://demo6705723.mockable.io/FeedInsta`)
    .then(response => {
      const totalItems = response.headers["x-total-count"]
      const data = response.data
      //console.log(data)
      setLoading(false)
      setTotal(Math.floor(totalItems / 4));
      setPage(pageNumber + 1);
      setFeed(shouldRefresh ? data : [...feed, ...data]);
    })
    .catch(err => {
      setError(err.message);
      setLoading(true)
    })
  }

  async function refreshList() {
    setRefreshing(true);
    
    await loadPage(1, true);

    setRefreshing(false);
  }

  const onGet = (id) => {
    try {

      const value = AsyncStorage.getItem(id);

      if (value !== null) {
        // We have data!!
        setComentarios(value)
      } 
    } catch (error) {
      // Error saving data
    }
  }

  const onSave = async (id) => {
    try {
      await AsyncStorage.setItem(id, text);
      setComentarios([...comentarios,...text])
    } catch (error) {
      // Error saving data
    }
  }
  const onSaveCurtida = async (author) => {
    try {
      await AsyncStorage.setItem(author, idCurtida);
      setCurtida([...curtida, ...idCurtida])
    } catch (error) {
      // Error saving data
    }
  }
  const onSaveCurtidComentario = async (author) => {
    try {
      await AsyncStorage.setItem(author, idCurtidaComentario);
      setCurtidaComentario([...curtidacomentario, ...idCurtidaComentario])
    } catch (error) {
      // Error saving data
    }
  }

  useEffect(() => {
    loadPage()
  }, []);

 

  const renderItem = ({item}) => {
    return (
      <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name}</Name>
            </Header>
            
            <ScrollView
            pagingEnabled 
            horizontal
            showHorizontalScrollIndicator={false}
            aspectRatio={item.aspectRatio} 
            shouldLoad={viewable.includes(item.id)}
            >
            <Image
              aspectRatio={item.aspectRatio} 
              shouldLoad={viewable.includes(item.id)} 
              smallSource={{ uri: item.small }}
              source={{uri: item.image }}                      
            />
            <Image
              aspectRatio={item.aspectRatio} 
              shouldLoad={viewable.includes(item.id)} 
              smallSource={{ uri: item.small }}             
              source={{uri: item.image1 }}             
            />          
            </ScrollView>
            <Description>
              <Name>{item.author.name}</Name> {item.description}´ 
            </Description>  

          <View>
          <Modal
          animationType={'slide'}
          transparent={false}
          visible={ListaCurtida}
          onRequestClose={() => {
            setListaCurtida(Boolean(false));
          }}>
           <View >            
            <Button style={styles.button}
              title="Curtidas:"
              onPress={() => {
                setListaCurtida(Boolean(false));
              }}
            />
             <Description>
              {curtida}
            </Description>  
            </View>
        </Modal>
        <Button style={styles.button}
          title="Curtidas"
          onPress={() => {
            setListaCurtida(Boolean(true));
          }}/>
      </View>
          
      <View >
          <Modal
          animationType={'slide'}
          transparent={false}
          visible={ListaComemtario}
          onRequestClose={() => {
            setListaComemtario(Boolean(false));
          }}>
           <View style={styles.comentarios}  >            
            <Button style={styles.button}
              title="Comentarios:"
              onPress={() => {
                setListaComemtario(Boolean(false));
              }}
            />
             <Description>               
             {comentarios}{curtidacomentario}
            </Description>                     
            </View>
            <IconEnt name="home"/>   
            <TextInput
              multiline={true}
              onChangeText={(text) => setText(text)}
              placeholder={"Comentários"}
              style={[styles.text]}
              maxLength={MAX_LENGTH}
              value={text}/>
            <Button style={styles.button}
              title="Comentar"
              onPress={() => onSave(String(item.id))}
              accessibilityLabel="Comentar">
            </Button>
        </Modal>
        <Button 
         style={styles.button}
          title="Comentarios"
          onPress={() => {
            setListaComemtario(Boolean(true));
          }}/>
      </View>
            <Description maxLength={2} style={styles.comentarios}>          
            {comentarios}
            <Button title="Curtir Comentario"             
              onPress={() => onSaveCurtidComentario(String(item.author), setidCurtidaComentario(String(item.author.name+'\n')) )}                        
              />  
            </Description>
           
            <Image style={styles.heartIcon}                         
              source={{uri: item.image3 }}                      
            />      
            <Button style={styles.button}               
              title="Curtir"             
              onPress={() => onSaveCurtida(String(item.author), setidCurtida(String(' '+item.author.name)) )}                                  
              >
             
            </Button>
            <TextInput
              multiline={true}
              onChangeText={(text) => setText(text)}
              placeholder={"Comentários"}
              style={[styles.text]}
              maxLength={MAX_LENGTH}
              value={text}/>
              
            <Button
              title="Comentar"
              onPress={() => onSave(String(item.id))}
              accessibilityLabel="Salvar Comentario">
            </Button>
            
         
             
      </Post>
    )
  }
  
  const handleViewableChanged = useCallback(({ changed }) => {
    setViewable(changed.map(({ item }) => item.id));
  }, []);

  return (
    <Container>
      <FlatList
        key="list"
        data={feed}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ListFooterComponent={loading && <Loading />}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 10,
        }}
        showsVerticalScrollIndicator={false}
        onRefresh={refreshList}
        refreshing={refreshing}
        onEndReachedThreshold={0.1}
        onEndReached={() => loadPage()}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    lineHeight: 33,
    color: "#333333",
    padding: 16,
    paddingTop: 16,
    minHeight: 170,
    borderTopWidth: 1,
    borderColor: "rgba(212,211,211, 0.3)"
},
  app: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    shadowColor: '#f1f1f1',
    shadowOpacity: 0.3,
    
  },Comentario: {
    alignItems: 'center',
    justifyContent: 'center',
   
    
  },Curtida: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    
  },
  heartIcon: {
    width: 20,
    height: 20,   
    width: 60,
    height: 60,   
  },
  menu:{
    backgroundColor: '#00213b'
  }
})
