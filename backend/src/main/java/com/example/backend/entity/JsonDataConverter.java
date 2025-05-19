package com.example.backend.entity;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.postgresql.util.PGobject;
import java.sql.SQLException;
@Converter
public class JsonDataConverter implements AttributeConverter<String, Object> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Object convertToDatabaseColumn(String attribute) {
        if (attribute == null) {
            return null;
        }

        try {
            // PostgreSQL JDBC driver's special object
            PGobject jsonObject = new PGobject();
            jsonObject.setType("json");

            // Assurez-vous que la chaîne est un JSON valide
            try {
                objectMapper.readTree(attribute);
                jsonObject.setValue(attribute);
            } catch (Exception e) {
                // Si ce n'est pas un JSON valide, encapsulez-le
                String jsonValue = "{\"value\": \"" + attribute.replace("\"", "\\\"") + "\"}";
                jsonObject.setValue(jsonValue);
            }

            return jsonObject;
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la conversion en JSON", e);
        }
    }

    @Override
    public String convertToEntityAttribute(Object dbData) {
        if (dbData == null) {
            return null;
        }

        if (dbData instanceof PGobject) {
            return ((PGobject) dbData).getValue();
        }

        return dbData.toString();
    }
}