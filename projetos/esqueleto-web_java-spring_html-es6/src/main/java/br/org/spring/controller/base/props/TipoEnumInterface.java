package br.org.spring.controller.base.props;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(using = TipoEnumSerializer.class)
public interface TipoEnumInterface {
	
	public Integer getCodigo();

	public String getDescricao();

}

class TipoEnumSerializer extends JsonSerializer<TipoEnumInterface> {
   
	@Override
    public void serialize(TipoEnumInterface tipo,
                          JsonGenerator generator,
                          SerializerProvider serializerProvider)
            throws IOException, JsonProcessingException {
        generator.writeStartObject();

        generator.writeFieldName("codigo");
        generator.writeNumber(tipo.getCodigo());

        generator.writeFieldName("descricao");
        generator.writeString(tipo.getDescricao());

        generator.writeEndObject();
    }
}
