package de.mischa.upload;

import lombok.Data;

@Data
public class UploadException extends RuntimeException {
    private String code;

    public UploadException(String message, String code) {
        super(message);
        this.code = code;
    }
}
