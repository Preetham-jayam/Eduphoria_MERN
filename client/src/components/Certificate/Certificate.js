import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const Certificate = ({ userName, courseTitle, instructorName }) => {
  const today = new Date();
  const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      textAlign: 'center', 
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#3498db', 
    },
    section: {
      marginBottom: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2ecc71', 
    },
    courseTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#e74c3c', 
    },
    instructorName: {
      fontSize: 16,
      fontStyle: 'italic',
      color: '#f39c12', 
    },
    dateAndPlatform: {
      fontSize: 12,
      color: '#34495e',
    },
    downloadButton: {
     marginLeft:110,
      marginTop: 20,
      padding: 10,
      backgroundColor: '#06bbcc',
      color: '#fff',
      cursor: 'pointer',
      borderRadius: 5,
    },
  });
  return (
    <PDFDownloadLink document={<Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          <Text style={styles.title}>Certificate of Completion</Text>
          <View style={styles.section}>
            <Text>This is to certify that</Text>
            <Text style={styles.name}>{userName}</Text>
          </View>
          <View style={styles.section}>
            <Text>has successfully completed the course</Text>
            <Text style={styles.courseTitle}>{courseTitle}</Text>
          </View>
          <View style={styles.section}>
            <Text>under the instruction of</Text>
            <Text style={styles.instructorName}>{instructorName}</Text>
          </View>
          <View style={styles.section}>
            <Text>Date: {formattedDate}</Text>
            <Text>Platform: Eduphoria</Text>
          </View>
        </View>
      </Page>
    </Document>} fileName={`Certificate_${userName}`}>
      {({ loading }) =>
        loading ? 'Loading document...' : (
          <button style={styles.downloadButton}>
            Download Certificate
          </button>
        )
      }
    </PDFDownloadLink>
  );
};

export default Certificate;
