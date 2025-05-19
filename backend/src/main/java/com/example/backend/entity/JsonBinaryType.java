package com.example.backend.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.type.SqlTypes;
import org.hibernate.usertype.UserType;
import org.postgresql.util.PGobject;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

public class JsonBinaryType implements UserType<String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public int getSqlType() {
        return Types.OTHER;
    }

    @Override
    public Class<String> returnedClass() {
        return String.class;
    }

    @Override
    public boolean equals(String x, String y) {
        return (x == y) || (x != null && x.equals(y));
    }

    @Override
    public int hashCode(String x) {
        return x == null ? 0 : x.hashCode();
    }

    @Override
    public String nullSafeGet(ResultSet rs, int position, SharedSessionContractImplementor session, Object owner) throws SQLException {
        String json = rs.getString(position);
        return rs.wasNull() ? null : json;
    }

    @Override
    public void nullSafeSet(PreparedStatement st, String value, int index, SharedSessionContractImplementor session) throws SQLException {
        if (value == null) {
            st.setNull(index, Types.OTHER);
        } else {
            try {
                PGobject jsonObject = new PGobject();
                jsonObject.setType("jsonb");

                // Validation JSON et conversion
                try {
                    MAPPER.readTree(value);
                    jsonObject.setValue(value);
                } catch (Exception e) {
                    // Si ce n'est pas un JSON valide, on l'encapsule
                    jsonObject.setValue("{\"value\": \"" + value.replace("\"", "\\\"") + "\"}");
                }

                st.setObject(index, jsonObject);
            } catch (Exception e) {
                throw new HibernateException("Erreur lors de la conversion en JSONB", e);
            }
        }
    }

    @Override
    public String deepCopy(String value) {
        return value;
    }

    @Override
    public boolean isMutable() {
        return true;
    }

    @Override
    public Serializable disassemble(String value) {
        return value;
    }

    @Override
    public String assemble(Serializable cached, Object owner) {
        return (String) cached;
    }
}