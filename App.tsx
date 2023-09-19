/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button, 
  Platform
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import AudioRecorderPlayer,{ AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,} from 'react-native-audio-recorder-player';

import {check, PERMISSIONS, RESULTS,request} from 'react-native-permissions';


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordTime, setRecordTime] = useState(false);
    const [recordSecs, setRecordSecs] = useState(0);

    const audioRecorderPlayer = new AudioRecorderPlayer();

    const onStartRecord = async () => {

        setIsRecording(true);

        const path = 'hello.m4a';
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    console.log('audioSet 150', audioSet);
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
    console.log('audioSet 152',);
    audioRecorderPlayer.addRecordBackListener((e) => {
         setRecordSecs(e.current_position);
         setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
    });
    console.log(`uri: 161 ${uri}`);


    };


        const onStopRecord = React.useCallback(async () => {
          const result = await audioRecorderPlayer.stopRecorder();
          audioRecorderPlayer.removeRecordBackListener();
          // setrecordSecs(0);
          setIsRecording(false);
          console.log(result);
          }, []);


    const onStartPlay = async () => {

      console.log('onStartPlay 190');
      const path = 'hello.m4a'
      

       try {

        const msg = await audioRecorderPlayer.startPlayer(path);
           console.log(' playing started 160 msg --> ', msg);
           audioRecorderPlayer.addPlayBackListener((e) => {
             console.log(' playing started 162 msg --> ', msg);
               if (e.current_position === e.duration) {
                   console.log('finished playing');
                   audioRecorderPlayer.stopPlayer();
                   setIsPlaying(false);
               }
               return;
           });
           console.log(' playing started 169');
       } catch (error) {
           console.error("Error playing the recording:", error);
       }
  };

  const onStopPlay = React.useCallback(async () => {
       if (!isPlaying) {
           console.log("Not currently playing.");
           return;
       }
       try {
           await audioRecorderPlayer.stopPlayer();
           audioRecorderPlayer.removePlayBackListener();
          setIsPlaying(false);
           console.log("stoped 186");
          
       } catch (error) {
           console.error("Error stopping the playback:", error);
       }

  },[]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text>React Native App {recordSecs} {"  /  "} {recordTime}
      </Text>
      <View>

      {/* <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? onStopRecord : onStartRecord}
      />

     <Button
        title={isRecording ? "Stop audio" : "Start audio"}
        onPress={onStartPlay}
      /> */}

<Button title="Start Record" onPress={onStartRecord} disabled={isRecording} />
            <Button title="Stop Record" onPress={onStopRecord} disabled={!isRecording} />
            <Button title="Play Record" onPress={onStartPlay} disabled={isPlaying} />
            <Button title="Stop Play" onPress={onStopPlay} disabled={!isPlaying} />


      {/* Implement other functionalities such as playback here */}

    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
